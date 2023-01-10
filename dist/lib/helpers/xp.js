import { createCanvas, registerFont, loadImage } from "canvas";
import Color from 'color';
import { canvasRGBA } from "stackblur-canvas";
import { groupDigits } from "#helpers/numbers";
export function getRequiredTotalXp(level) {
    return Math.floor(5 * Math.pow(135, 2) * ((Math.pow(10, 3) * Math.exp(-Math.pow(10, -3) * level) + level) - Math.pow(10, 3)));
}
;
export function getRequiredLevelXp(level) {
    return level > 0 ? getRequiredTotalXp(level) - getRequiredTotalXp(level - 1) : getRequiredTotalXp(level);
}
export function getLevel(xp) {
    let level = 0;
    while (xp > getRequiredTotalXp(level + 1)) {
        level++;
    }
    ;
    return level;
}
;
export function currentLevelProgress(xp) {
    return xp - getRequiredTotalXp(getLevel(xp));
}
;
export async function card(member, client) {
    const members = (await client.db.fetchGuildMembers(member.guild));
    const memberData = members.find(u => u.user_id === member.id) || await client.db.fetchMember(member);
    //Colours
    const colors = {
        bg: '#141414',
        bga: '',
        highlight: '#ffffff',
        highlightDark: '#ababab',
        border: '#1c1c1c',
        main: '#f1f1f1'
    };
    registerFont('./src/assets/fonts/bahnschrift-main.ttf', { family: 'bahnschrift' });
    const canvas = createCanvas(640, 192);
    const ctx = canvas.getContext('2d');
    let rank = members.sort((a, b) => b.xp - a.xp).findIndex(u => u.user_id === member.id) + 1;
    const avatar = await loadImage(member.displayAvatarURL({ size: 128, extension: 'png' }));
    let statusColor;
    switch (member.presence?.status) {
        case 'online':
            statusColor = '#5cb85c';
            break;
        case 'idle':
            statusColor = '#f0ad4e';
            break;
        case 'dnd':
            statusColor = '#d9454f';
            break;
        case 'offline':
        default:
            statusColor = '#545454';
            break;
    }
    ctx.save();
    //Fill BG
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar, 180, -128, 512, 512);
    //Transparent bg colour
    colors.bga = Color(colors.bg).fade(1);
    let grd = ctx.createLinearGradient(180, 0, canvas.width + 500, 0);
    grd.addColorStop(0, colors.bg);
    grd.addColorStop(1, colors.bga.rgb().string());
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, 15);
    //Outline
    ctx.lineWidth = 10;
    ctx.strokeStyle = colors.border;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    //Draw Avatar
    ctx.beginPath();
    ctx.arc(96, 96, 64, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 32, 32, 128, 128);
    ctx.restore();
    //Outline Avatar
    ctx.beginPath();
    ctx.arc(96, 96, 70, 0, Math.PI * 2, true);
    ctx.strokeStyle = colors.bg;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = colors.highlight;
    ctx.lineWidth = 2;
    ctx.stroke();
    //Status
    ctx.beginPath();
    ctx.arc(144, 144, 18, 0, Math.PI * 2, true);
    ctx.fillStyle = statusColor;
    ctx.fill();
    ctx.strokeStyle = colors.bg;
    ctx.lineWidth = 4;
    ctx.stroke();
    //Calc Level
    const level = getLevel(memberData.xp);
    //Bar constants
    const [barX, barY, barRad, barLen] = [192, 128, 16, 400];
    const minXP = getRequiredTotalXp(level);
    const maxXP = getRequiredTotalXp(level + 1);
    const currentXP = memberData.xp - minXP;
    const progress = (memberData.xp - minXP) / (maxXP - minXP);
    //Outline Bar
    ctx.beginPath();
    ctx.arc(barX, barY, (barRad + 2), -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(barX + barLen, barY + (barRad + 2));
    ctx.arc(barX + barLen, barY, (barRad + 2), Math.PI / 2, -Math.PI / 2, true);
    ctx.lineTo(barX, barY - (barRad + 2));
    ctx.strokeStyle = colors.bg;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.strokeStyle = colors.highlight;
    ctx.lineWidth = 2;
    ctx.stroke();
    //Fill Bar
    let newBarLen = barLen * progress;
    ctx.beginPath();
    ctx.arc(barX, barY, (barRad - 2), -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(barX + newBarLen, barY + (barRad - 2));
    ctx.arc(barX + newBarLen, barY, (barRad - 2), Math.PI / 2, -Math.PI / 2, true);
    ctx.lineTo(barX, barY - (barRad - 2));
    ctx.strokeStyle = colors.bg;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = colors.main;
    ctx.fill();
    //Text
    const applyText = (canvas, text, size) => {
        const ctx = canvas.getContext('2d');
        let fontSize = size;
        do {
            ctx.font = `${fontSize -= 5}px "bahnschrift"`;
        } while (ctx.measureText(text).width > barLen);
        return ctx.font;
    };
    //Name
    ctx.strokeStyle = colors.bg;
    ctx.lineWidth = 5;
    ctx.font = applyText(canvas, member.user.tag, 32);
    ctx.fillStyle = colors.highlight;
    ctx.strokeText(member.user.tag, barX, barY - barRad - 10);
    ctx.fillText(member.user.tag, barX, barY - barRad - 10);
    //Progress
    const progStr = `${groupDigits(currentXP)} / ${groupDigits(maxXP - minXP)} xp`;
    ctx.font = applyText(canvas, progStr, 26);
    ctx.strokeText(progStr, barX, barY + barRad + 28);
    ctx.fillStyle = colors.highlightDark;
    ctx.fillText(progStr, barX, barY + barRad + 28);
    //Level
    ctx.fillStyle = colors.main;
    ctx.font = '48px "bahnschrift"';
    let numWidth = ctx.measureText(`${level}`).width;
    ctx.strokeText(`${level}`, 608 - numWidth, 52);
    ctx.fillText(`${level}`, 608 - numWidth, 52);
    ctx.font = '32px "bahnschrift"';
    let textWidth = ctx.measureText(`Level `).width;
    ctx.strokeText(`Level `, 608 - textWidth - numWidth, 52);
    ctx.fillText(`Level `, 608 - textWidth - numWidth, 52);
    const levelWidth = numWidth + textWidth;
    //Rank
    ctx.fillStyle = colors.highlightDark;
    ctx.font = '48px "bahnschrift"';
    numWidth = ctx.measureText(`#${rank}`).width;
    ctx.strokeText(`#${rank}`, 592 - numWidth - levelWidth, 52);
    ctx.fillText(`#${rank}`, 592 - numWidth - levelWidth, 52);
    ctx.font = '32px "bahnschrift"';
    textWidth = ctx.measureText(`Rank `).width;
    ctx.strokeText(`Rank `, 592 - textWidth - numWidth - levelWidth, 52);
    ctx.fillText(`Rank `, 592 - textWidth - numWidth - levelWidth, 52);
    return canvas.toBuffer();
}
;
export async function leaderboard(members, page, guild, client) {
    registerFont('./src/assets/fonts/bahnschrift-main.ttf', { family: 'bahnschrift' });
    const canvas = createCanvas(1024, 900);
    const ctx = canvas.getContext('2d');
    const fontsize = 55;
    const applyText = (text, maxWidth) => {
        let fontSize = fontsize;
        do {
            ctx.font = `${fontSize -= 5}px "bahnschrift"`;
        } while (ctx.measureText(text).width > maxWidth && fontSize > 0);
        return ctx.font;
    };
    ctx.fillStyle = '#fefefe';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    // Rank
    ctx.textAlign = 'center';
    ctx.font = applyText('RANK', 150);
    ctx.strokeText('RANK', 100, 55);
    ctx.fillText('RANK', 100, 55);
    // Name
    ctx.textAlign = 'center';
    ctx.font = applyText('USER', 400);
    ctx.strokeText('USER', 450, 55);
    ctx.fillText('USER', 450, 55);
    // XP
    ctx.textAlign = 'center';
    ctx.strokeText('EXP', 850, 55);
    ctx.fillText('EXP', 850, 55);
    for (let i = page * 10; i < (page + 1) * 10; i++) {
        const m = members[i];
        const user = await client.util.getDatabaseMemberUser(m);
        const tag = user?.tag || '`Deleted User`';
        const member = user ? (await client.util.getMemberFromUser(user, guild)) : undefined;
        const nameColor = member ? member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor : '#ffffff';
        const rank = (i + 1);
        const pos = rank - (page * 10);
        const y = 45 + (pos * fontsize * 1.5);
        ctx.save();
        // Background
        ctx.beginPath();
        ctx.moveTo(10, y + 10);
        ctx.lineTo(10, y - 40);
        ctx.arc(20, y - 40, 10, Math.PI, 3 * Math.PI / 2);
        ctx.lineTo(canvas.width - 20, y - 50);
        ctx.arc(canvas.width - 20, y - 40, 10, 3 * Math.PI / 2, 0);
        ctx.lineTo(canvas.width - 10, y - 40);
        ctx.arc(canvas.width - 20, y + 10, 10, 0, Math.PI / 2);
        ctx.lineTo(20, y + 20);
        ctx.arc(20, y + 10, 10, Math.PI / 2, Math.PI);
        ctx.closePath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#212121';
        ctx.stroke();
        ctx.clip();
        ctx.fillStyle = '#3e3e42';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!m) {
            ctx.restore();
            continue;
        }
        const perc = (currentLevelProgress(m.xp) / getRequiredLevelXp(getLevel(m.xp) + 1));
        ctx.fillStyle = '#2f3136';
        ctx.fillRect(0, 0, canvas.width * perc, canvas.height);
        ctx.restore();
        // TEXT
        ctx.fillStyle = '#fefefe';
        ctx.lineWidth = 4;
        // Rank
        let text = `${rank}`;
        ctx.textAlign = 'center';
        ctx.font = applyText(text, 100);
        ctx.strokeText(text, 100, y);
        ctx.fillText(text, 100, y);
        ctx.fillStyle = nameColor;
        // Level
        text = `[${getLevel(m.xp)}]`;
        ctx.textAlign = 'center';
        ctx.font = applyText(text, 100);
        ctx.strokeText(text, 250, y);
        ctx.fillText(text, 250, y);
        // Name
        text = tag;
        ctx.textAlign = 'left';
        ctx.font = applyText(text, 400);
        ctx.strokeText(text, 300, y);
        ctx.fillText(text, 300, y);
        // XP
        text = `${groupDigits(m.xp)} XP`;
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fefefe';
        ctx.font = applyText(text, 300);
        ctx.strokeText(text, canvas.width - 50, y);
        ctx.fillText(text, canvas.width - 50, y);
    }
    return canvas.toBuffer();
}
//# sourceMappingURL=xp.js.map