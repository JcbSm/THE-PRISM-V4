import type { PrismClient } from "#lib/PrismClient";
import type { Guild, GuildMember } from "discord.js";
import { createCanvas, registerFont, loadImage } from "canvas";
import Color from 'color';
import { canvasRGBA } from "stackblur-canvas";
import { groupDigits } from "#helpers/numbers";
import type { DatabaseMember } from "#lib/database/DatabaseMember";

export function getRequiredXP(level: number): number {
    return Math.floor(5 * Math.pow(135, 2) * ((Math.pow(10, 3) * Math.exp(-Math.pow(10, -3)* level) + level) - Math.pow(10, 3)));
};

export function getLevel(xp: number): number {
    let level = 0;
    while (xp > getRequiredXP(level + 1)) {
        level++;
    };
    return level;
};

export async function card(member: GuildMember, client: PrismClient): Promise<Buffer> {

    const members = (await client.db.fetchGuildMembers(member.guild));
    const memberData = members.find(u => u.user_id === member.id) || await client.db.fetchMember(member);

    //Colours
    const colors = {
        bg: '#141414',
        bga: '' as any,
        highlight: '#ffffff',
        highlightDark: '#ababab',
        border: '#1c1c1c',
        main: '#f1f1f1'
    }

    registerFont('./src/assets/fonts/bahnschrift-main.ttf', {family: 'bahnschrift'})

    const canvas = createCanvas(640, 192)
    const ctx = canvas.getContext('2d')

    let rank = members.sort((a, b) => b.xp - a.xp).findIndex(u => u.user_id === member.id)+1;

    const avatar = await loadImage(member.displayAvatarURL({size: 128, format: 'png'}));
    let statusColor;
    switch(member.presence?.status) {
        case 'online':
            statusColor = '#5cb85c'
            break;
        case 'idle':
            statusColor = '#f0ad4e'
            break;
        case 'dnd':
            statusColor = '#d9454f'
            break;
        case 'offline':
        default:
            statusColor = '#545454'
            break;
    }

    ctx.save()
    
    //Fill BG
    ctx.fillStyle = colors.bg
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(avatar, 180, -128, 512, 512)
    //Transparent bg colour
    colors.bga = Color(colors.bg).fade(1);
    let grd = ctx.createLinearGradient(180, 0, canvas.width+500, 0); grd.addColorStop(0, colors.bg); grd.addColorStop(1, colors.bga.rgb().string());

    ctx.fillStyle = grd; ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvasRGBA(canvas as unknown as HTMLCanvasElement, 0, 0, canvas.width, canvas.height, 15)
    
    //Outline
    ctx.lineWidth = 10
    ctx.strokeStyle = colors.border
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    //Draw Avatar
    ctx.beginPath();
    ctx.arc(96, 96, 64, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 32, 32, 128, 128)

    ctx.restore()

    //Outline Avatar
    ctx.beginPath();
    ctx.arc(96, 96, 70, 0, Math.PI * 2, true);
    ctx.strokeStyle = colors.bg
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = colors.highlight
    ctx.lineWidth = 2;
    ctx.stroke();

    //Status
    ctx.beginPath();
    ctx.arc(144, 144, 18, 0, Math.PI * 2, true);
    ctx.fillStyle = statusColor;
    ctx.fill();
    ctx.strokeStyle = colors.bg
    ctx.lineWidth = 4;
    ctx.stroke();

    //Calc Level
    const level = getLevel(memberData.xp)
    
    //Bar constants
    const [barX, barY, barRad, barLen] = [192, 128, 16, 400]
    const minXP = getRequiredXP(level);
    const maxXP = getRequiredXP(level+1);
    const currentXP = memberData.xp-minXP;
    const progress = (memberData.xp - minXP)/(maxXP - minXP)

    //Outline Bar
    ctx.beginPath();
    ctx.arc(barX, barY, (barRad+2), -Math.PI/2, Math.PI/2, true);
    ctx.lineTo(barX+barLen, barY+(barRad+2));
    ctx.arc(barX+barLen, barY, (barRad+2), Math.PI/2, -Math.PI/2, true);
    ctx.lineTo(barX, barY-(barRad+2));
    ctx.strokeStyle = colors.bg
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = colors.highlight;
    ctx.lineWidth = 2;
    ctx.stroke();

    //Fill Bar
    let newBarLen = barLen * progress
    ctx.beginPath();
    ctx.arc(barX, barY, (barRad-2), -Math.PI/2, Math.PI/2, true);
    ctx.lineTo(barX+newBarLen, barY+(barRad-2));
    ctx.arc(barX+newBarLen, barY, (barRad-2), Math.PI/2, -Math.PI/2, true);
    ctx.lineTo(barX, barY-(barRad-2));

    ctx.strokeStyle = colors.bg
    ctx.lineWidth = 5
    ctx.stroke();
    ctx.fillStyle = colors.main;
    ctx.fill();

    //Text
    const applyText = (canvas: any, text: string, size: number) => {
        const ctx = canvas.getContext('2d');
        let fontSize = size;
        do {
            ctx.font = `${fontSize -= 5}px "bahnschrift"`;
        } while (ctx.measureText(text).width > barLen);
        return ctx.font;
    };

    //Name
    ctx.strokeStyle = colors.bg
    ctx.lineWidth = 5

    ctx.font = applyText(canvas, member.user.tag, 32);
    ctx.fillStyle = colors.highlight;
    ctx.strokeText(member.user.tag, barX, barY-barRad-10)
    ctx.fillText(member.user.tag, barX, barY-barRad-10)

    //Progress
    const progStr = `${groupDigits(currentXP)} / ${groupDigits(maxXP - minXP)} xp`
    ctx.font = applyText(canvas, progStr, 26);
    ctx.strokeText(progStr, barX, barY+barRad+28)
    ctx.fillStyle = colors.highlightDark;
    ctx.fillText(progStr, barX, barY+barRad+28)
    
    //Level
    ctx.fillStyle = colors.main
    ctx.font = '48px "bahnschrift"';
    let numWidth = ctx.measureText(`${level}`).width;
    ctx.strokeText(`${level}`, 608-numWidth, 52)
    ctx.fillText(`${level}`, 608-numWidth, 52)
    ctx.font = '32px "bahnschrift"';
    let textWidth = ctx.measureText(`Level `).width;
    ctx.strokeText(`Level `, 608-textWidth-numWidth, 52)
    ctx.fillText(`Level `, 608-textWidth-numWidth, 52)

    const levelWidth = numWidth+textWidth;

    //Rank
    ctx.fillStyle = colors.highlightDark
    ctx.font = '48px "bahnschrift"';
    numWidth = ctx.measureText(`#${rank}`).width;
    ctx.strokeText(`#${rank}`, 592-numWidth-levelWidth, 52)
    ctx.fillText(`#${rank}`, 592-numWidth-levelWidth, 52)
    ctx.font = '32px "bahnschrift"';
    textWidth = ctx.measureText(`Rank `).width;
    ctx.strokeText(`Rank `, 592-textWidth-numWidth-levelWidth, 52)
    ctx.fillText(`Rank `, 592-textWidth-numWidth-levelWidth, 52)

    return canvas.toBuffer()

};

export async function leaderboard(members: DatabaseMember[], guild: Guild, client: PrismClient) {

    const maxNameWidth = 400

    const applyText = (canvas: any, text: string, size: number) => {
        const ctx = canvas.getContext('2d');
        let fontSize = size;
        do {
            ctx.font = `${fontSize -= 5}px "bahnschrift"`;
        } while (ctx.measureText(text).width > maxNameWidth && fontSize > 0);
        return ctx.font;
    };    
    
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');
    registerFont('./src/assets/fonts/bahnschrift-main.ttf', {family: 'bahnschrift'});
    
    ctx.fillStyle = '#36393f'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

    const fontsize = 50;
    ctx.font = `${fontsize}px "bahnschrift"`;

    for (let i = 0; i < members.length; i++) {

        const member = members[i];
        const tag = await client.util.getDatabaseMemberUserTag(member);
        const rank = i + 1;
        const y = (rank * fontsize * 1.75);
        
        ctx.font = `${fontsize}px "bahnschrift"`;

        // Rank
        ctx.strokeText(`${rank}.`, 40, y);
        ctx.fillText(`${rank}.`, 40, y);
        
        // Name
        ctx.font = applyText(canvas, tag, fontsize)
        ctx.strokeText(tag, 150, y);
        ctx.fillText(tag, 150, y);

    }
    
    return canvas.toBuffer();

}