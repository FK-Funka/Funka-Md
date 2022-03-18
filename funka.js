const { downloadContentFromMessage, generateWAMessageFromContent, proto } = require("@adiwajshing/baileys-md")
const moment = require("moment-timezone")
const fs = require("fs")
const axios = require("axios")
const cheerio = require('cheerio')
const { exec, spawn } = require("child_process")
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
const ffmpeg = require("fluent-ffmpeg")
const xfar = require("xfarr-api")
const hxz = require("hxz-api")
const Carbon = require("unofficial-carbon-now")
const tesseract = require("node-tesseract-ocr")
const yts = require( 'yt-search' )
const translate = require('translate-google')


const color = require("../lib/color.js")
const { ownerNumber, ownerNumberg, stickerInfo } = require("../database.json")
const { getBuffer, getRandom, getGroupAdmins, runtime, sleep, short, webp2mp4File, convert } = require("../lib/function.js")
const { pinterest, igstalk, igdl } = require("../lib/scrape.js")
const { yt } = require("../lib/yt.js")
const ind = require("./ind.js")

multi = true


module.exports = async(funka, msg) => {
    try {
    const time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('DD/MM/YY HH:mm:ss z')
    const ucapan = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
    const fromMe = msg.key.fromMe
    const content = JSON.stringify(msg.message)
    const from = msg.key.remoteJid
    const type = Object.keys(msg.message)[0]
    const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type == 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type == 'templateButtonReplyMessage') && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'listResponseMessage' && msg.message.listResponseMessage.title) ? msg.message.listResponseMessage.title : ""
    const cmd = (type === 'listResponseMessage' && msg.message.listResponseMessage.title) ? msg.message.listResponseMessage.title : (type === 'buttonsResponseMessage' && msg.message.buttonsResponseMessage.selectedButtonId) ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'conversation' && msg.message.conversation.startsWith(prefix)) ? msg.message.conversation : (type == 'imageMessage') && msg.message.imageMessage.caption.startsWith(prefix) ? msg.message.imageMessage.caption : (type == 'videoMessage') && msg.message.videoMessage.caption.startsWith(prefix) ? msg.message.videoMessage.caption : (type == 'extendedTextMessage') && msg.message.extendedTextMessage.text.startsWith(prefix) ? msg.message.extendedTextMessage.text : ""
    const command = chats.toLowerCase().split(' ')[0] || ''
    const args = chats.trim().split(/ +/).slice(1)
    const isCmd = chats.startsWith(prefix)
    const q = args.join(' ')
    const pushname = msg.pushName
    const isGroup = msg.key.remoteJid.endsWith('@g.us')
    const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
    const isOwner = isGroup ? sender.includes(ownerNumberg) : sender.includes(ownerNumber)
    const botNumber = funka.user.id.split(':')[0] + '@s.whatsapp.net'  
    const groupMetadata = isGroup ? await funka.groupMetadata(from) : ''  
    const groupMembers = isGroup ? groupMetadata.participants : ''
    const groupAdmins = isGroup ? ind.getGroupAdmins(groupMembers) : ''
	const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
	const isGroupAdmins = groupAdmins.includes(sender.split(":")[0]+"@s.whatsapp.net") || false
  
    const isImage = (type == 'imageMessage')
    const isVideo = (type == 'videoMessage')
    const isSticker = (type == 'stickerMessage')
    const isQuotedMsg = (type == 'extendedTextMessage')
    const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
    const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
    const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
    const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
    const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false
    const isUrl = (uri) => {
	    return uri.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
    }

    if (multi) {
        var prefix = /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ_&<`™©®Δ^βα¦|/\\©^]/.test(chats) ? chats.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ_&<!`™©®Δ^βα¦|/\\©^]/gi) : '.'
    } else {
        if (nopref) {
            prefix = ''
        } else {
            prefix = prefa
        }
    }
    
    //=====[ OCR ]=====\\
    const configocr = {
        lang: "eng",
        oem: 1,
        psm: 3,
    }
    
    //=====[ CMD MSG ]=====\\
    
    if (isCmd) {
        console.log(color('[CMD]', 'cyan'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'orange'), color(command, 'cyan'), color(pushname, 'orange'), color(sender, 'lime'))
    }

    //=====[ FUNCTIONS ]=====\\
    
    const adReply = async(teks, judul, isi, quo) => {
        funka.sendMessage(from, {text: teks, contextInfo:{"externalAdReply": {title: judul, body: isi, mediaType: 3, "thumbnail": fs.readFileSync('./src/foto.jpg')}}}, {sendEphemeral: true, quoted: quo })
    }
    
    const textImg = (teks, buffer = fs.readFileSync("src/foto.jpg"), mess, men) => {
        return funka.sendMessage(from, { text: teks, jpegThumbnail: buffer, mention: men ? men : [] }, { quoted: mess ? mess : msg })
    }
    
    async function downloadAndSaveMediaMessage (type_file, path_file) {
        if (type_file === 'image') {
            var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
            let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        await fs.writeFileSync(path_file, buffer)
        return fs.readFileSync(path_file)
    } else if (type_file === 'video') {
            var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
            let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        await fs.writeFileSync(path_file, buffer)
        return fs.readFileSync(path_file)
    } else if (type_file === 'sticker') {
            var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
            let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        await fs.writeFileSync(path_file, buffer)
        return fs.readFileSync(path_file)
    } else if (type_file === 'audio') {
            var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
            let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        await fs.writeFileSync(path_file, buffer)
        return fs.readFileSync(path_file)
      }
    }
    
    const sendFileFromUrl = async (from, url, caption, msg, men) => {
        let mime = '';
        let res = await axios.head(url)
        mime = res.headers['content-type']
    if (mime.split("/")[1] === "gif") {
        return funka.sendMessage(from, { video: await convertGif(url), caption: caption, gifPlayback: true, mentions: men ? men : []}, {quoted: msg})
        }
        let type = mime.split("/")[0]+"Message"
    if (mime.split("/")[0] === "image") {
        return funka.sendMessage(from, { image: await getBuffer(url), caption: caption, mentions: men ? men : []}, {quoted: msg})
        }
    if (mime.split("/")[0] === "video") {
        return funka.sendMessage(from, { video: await getBuffer(url), caption: caption, mentions: men ? men : []}, {quoted: msg})
        }
    if (mime.split("/")[0] === "audio") {
        return funka.sendMessage(from, { audio: await getBuffer(url), caption: caption, mentions: men ? men : [], mimetype: 'audio/mpeg'}, {quoted: msg })
        }
    if (mime.split("/")[0] === "document") {
        return funka.sendMessage(from, { document: await getBuffer(url), mimetype: mime, caption: caption, mentions: men ? men : []}, {quoted: msg })
      }
    }
    
    //=====[ EVAL ]=====\\
    if (isOwner){
    if (chats.startsWith("> ")){
        console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Owner!`))
    try {
            let evaled = await eval(chats.slice(2))
    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
            textImg(`${evaled}`)
    } catch (err) {
            textImg(`${err}`)
        }
    } else if (chats.startsWith("$ ")){
        console.log(color('[EXEC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Owner!`))
    exec(chats.slice(2), (err, stdout) => {
        if (err) return textImg(`${err}`)
        if (stdout) textImg(`${stdout}`)
       })
      }
    }

    //=====[ MENU BUTTON ]=====\\
    const menuBut = [
        {index: 1, urlButton: {displayText: 'Source Code', url: 'https://github.com/FK-Funka/Funka-Md'}},
        {index: 2, callButton: {displayText: 'Owner', phoneNumber: '+6283818221226'}},
        {index: 3, quickReplyButton: {displayText: 'DONASI', id: prefix+'donate'}},
        {index: 4, quickReplyButton: {displayText: 'RULES', id: prefix+'rules'}},
        {index: 5, quickReplyButton: {displayText: 'RUNTIME', id: prefix+'runtime'}},
    ]
    
    switch (command) {
    case prefix+"menu":
    case prefix+"help":
        menunya = `╭「 *INFO BOT* 」
├ *Name:* Funka-Bot
├ *Author:* Nurul
├ *Owner:* FxSx
├ *Library:* Baileys
└ *Terminal:* Termux

╭「 *ABOUT* 」
├ ${prefix}owner
├ ${prefix}rules
├ ${prefix}donate
├ ${prefix}sewa
├ ${prefix}allmenu
├ ${prefix}delete
└ ${prefix}runtime

╭「 *INFORMASI* 」
├ ${prefix}translate
└ ${prefix}gempa

╭「 *ANIME* 」
├ ${prefix}anime 
├ ${prefix}manga 
├ ${prefix}character
└ ${prefix}waifu

╭「 *SEARCH* 」
├ ${prefix}film 
├ ${prefix}lirik 
├ ${prefix}wattpad 
├ ${prefix}webtoons 
├ ${prefix}drakor 
├ ${prefix}pinterest 
├ ${prefix}gcsearch 
└ ${prefix}igstalk 

╭「 *MEDIA* 」
├ ${prefix}toimg 
├ ${prefix}tomp3 
├ ${prefix}sticker 
└ ${prefix}ocr

╭「 *MAKER* 」
└ ${prefix}carbon

╭「 *DOWNLOAD* 」
├ ${prefix}tiktok 
├ ${prefix}ytmp3 
├ ${prefix}ytmp4 
├ ${prefix}play 
├ ${prefix}facebook 
├ ${prefix}twitter 
└ ${prefix}instagram

╭「 *GROUP* 」
├ ${prefix}revoke
├ ${prefix}add 
├ ${prefix}kick 
├ ${prefix}promote 
├ ${prefix}demote 
├ ${prefix}leave
├ ${prefix}group
└ ${prefix}hidetag

╭「 *OWNER* 」
├ > evaluate
├ $ exec
├ ${prefix}join
├ ${prefix}leave
└ ${prefix}setppbot 
`
        await funka.sendMessage(from, {caption: menunya, location: {jpegThumbnail: fs.readFileSync("./src/foto.jpg")}, templateButtons: menuBut, footer: `      ${time}\n      © Nurul`})
    break
    case prefix+"sewa":
        textImg(ind.rent())
    break
    case prefix+"owner":
        for (let x of ownerNumber) {
             const vcard = 'BEGIN:VCARD\n'
                 + 'VERSION:3.0\n' 
                 + 'FN:Nurul\n'
                 + 'ORG:Owner Funka-Bot;\n'
                 + 'TEL;type=CELL;type=VOICE;waid=17072293682:+1 707 229 3682\n'
                 + 'END:VCARD'
        funka.sendMessage(from, { contacts: { displayName: 'funka', contacts: [{ vcard }] }})
    }
    break
    case prefix+"donate":
    case prefix+"donasi":
        textImg(ind.donate())
    break
    case prefix+"rules":
    case prefix+"rule":
        textImg(ind.rules(prefix))
    break
    case prefix+"del":
    case prefix+"delete":
    case prefix+"hapus":
        if (!isQuotedMsg) return textImg(ind.wrongFormat(prefix))
        if (msg.message.extendedTextMessage.contextInfo.participant = botNumber) {
            funka.sendMessage(from, { delete: { remoteJid: from, fromMe: true, id: msg.message.extendedTextMessage.contextInfo.stanzaId, participant: botNumber }})
        } else {
            textImg(ind.wrongFormat(prefix))
    }
    break
    case prefix+"runtime":
        const formater = (seconds) => {
        const pad = (s) => {
            return (s < 10 ? '0' : '') + s
        }
        const hrs = Math.floor(seconds / (60 * 60))
        const mins = Math.floor(seconds % (60 * 60) / 60)
        const secs = Math.floor(seconds % 60)
            return ' ' + pad(hrs) + ':' + pad(mins) + ':' + pad(secs)
        }
        const uptime = process.uptime()
            await textImg(`*${formater(uptime)}*`)
    break
    //=====[ OWNER ]=====\\
    case prefix+"eval":
        if (!isOwner) return
        if (!q) return textImg("Masukkan Javascript Code!")
        try {
            let evaled = await eval(chats.slice(6))
        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
            textImg(`${evaled}`)
        } catch (err) {
            textImg(`${err}`)
    }
    break
    case prefix+"join": 
        if (!q) return textImg(ind.wrongFormat(prefix))
        if (!q.includes("https://chat.whatsapp.com/")) return textImg(ind.wrongFormat(prefix))
        try {
            const response = await funka.groupAcceptInvite(q.split("https://chat.whatsapp.com/")[1])
            console.log(color('[JOIN GROUP]', 'lime'), color(response, 'cyan'))
        } catch (err) {
            textImg("Pastikan Link Group Benar Dan Tidak Kadaluarsa!")
    }
    break
    case prefix+"leave":
        try {
        if (q) {
            await funka.groupLeave(q)
            console.log(color('[Leave GROUP]', 'lime'), color(q, 'cyan'))
        } else {
            await funka.groupLeave(from)
            console.log(color('[Leave GROUP]', 'lime'), color(from, 'cyan'))
          }
        } catch (err) {
            textImg("Pastikan Link Group Benar Dan Tidak Kadaluarsa!")
    }
    break
    case prefix+"setppbot":
    case prefix+"setpp":
        if (!isOwner) return 
        if (isImage || isQuotedImage) {
            let ppimg = await downloadAndSaveMediaMessage('image','ppeehhh.jpeg')
            await funka.updateProfilePicture(botNumber, { url: 'ppeehhh.jpeg'})
            textImg("Done!")
        } else {
            textImg(ind.wrongFormat(prefix))
    }
    break
    //=====[ GROUP ]=====\\
    case prefix+"revoke":
        if (!isGroup) return textImg("Perintah Ini Hanya Bisa Digunakan di Group!")
        if (!isGroupAdmins) return textImg("Perintah Ini Hanya Bisa Digunakan Oleh Admin Group!")
        if (!isBotGroupAdmins) return textImg("Jadikan Bot Admin Dahulu!")
        try {
            const code = await funka.groupRevokeInvite(from)
            funka.sendMessage(from, {text: "Link Group Telah DiUbah Oleh Admin @" + sender.split('@')[0].split(":")[0], contextInfo: {mentionedJid: [sender]}})
            funka.sendMessage(sender, {text: `New Group Link: https://chat.whatsapp.com/${code}`}, {quoted: msg})
        } catch (err) {
            textImg(`${err}`)
    }
    break
    case prefix+"add":
        if (!isGroup) return textImg("Perintah Ini Hanya Bisa Digunakan di Group!")
        if (!isGroupAdmins) return textImg("Perintah Ini Hanya Bisa Digunakan Oleh Admin Group!")
        if (!isBotGroupAdmins) return textImg("Jadikan Bot Admin Dahulu!")
        if (q) {
            funka.groupParticipantsUpdate(from, [q], "add")
        } else {
            textImg(ind.wrongFormat(prefix))
    }
    break
    case prefix+"kick":
        if (!isGroup) return textImg("Perintah Ini Hanya Bisa Digunakan di Group!")
        if (!isGroupAdmins) return textImg("Perintah Ini Hanya Bisa Digunakan Oleh Admin Group!")
        if (!isBotGroupAdmins) return textImg("Jadikan Bot Admin Dahulu!")
        if (isQuotedMsg) { 
            funka.groupParticipantsUpdate(from, [msg.message.extendedTextMessage.contextInfo.participant], "remove")
        } else {
        if (!q) return textImg(ind.wrongFormat(prefix))
            funka.groupParticipantsUpdate(from, [msg.message.extendedTextMessage.contextInfo.mentionedJid], "remove")
    }
    break
    case prefix+"promote":
        if (!isGroup) return textImg("Perintah Ini Hanya Bisa Digunakan di Group!")
        if (!isGroupAdmins) return textImg("Perintah Ini Hanya Bisa Digunakan Oleh Admin Group!")
        if (!isBotGroupAdmins) return textImg("Jadikan Bot Admin Dahulu!")
        if (isQuotedMsg) { 
            funka.groupParticipantsUpdate(from, [msg.message.extendedTextMessage.contextInfo.participant], "promote")
        } else {
        if (!q) return textImg(ind.wrongFormat(prefix))
            funka.groupParticipantsUpdate(from, [msg.message.extendedTextMessage.contextInfo.mentionedJid], "promote")
    }
    break
    case prefix+"demote":
        if (!isGroup) return textImg("Perintah Ini Hanya Bisa Digunakan di Group!")
        if (!isGroupAdmins) return textImg("Perintah Ini Hanya Bisa Digunakan Oleh Admin Group!")
        if (!isBotGroupAdmins) return textImg("Jadikan Bot Admin Dahulu!")
        if (isQuotedMsg) { 
            funka.groupParticipantsUpdate(from, [msg.message.extendedTextMessage.contextInfo.participant], "demote")
        } else {
        if (!q) return textImg(ind.wrongFormat(prefix))
            funka.groupParticipantsUpdate(from, [q.split('@')[1]+"@s.whatsapp.net"], "demote")
    }
    break
    case prefix+"leave":
        if (!isGroup) return textImg("Perintah Ini Hanya Bisa Digunakan di Group!")
        if (!isGroupAdmins) return textImg("Perintah Ini Hanya Bisa Digunakan Oleh Admin Group!")
        try {
            funka.groupLeave(from) 
        } catch (err) {
            funka.groupLeave(from) 
    }
    break
    case prefix+"group":
        if (!isGroup) return textImg("Perintah Ini Hanya Bisa Digunakan di Group!")
        if (!isGroupAdmins) return textImg("Perintah Ini Hanya Bisa Digunakan Oleh Admin Group!")
        if (!isBotGroupAdmins) return textImg("Jadikan Bot Admin Dahulu!")
        if (q === "open") {
            await funka.groupSettingUpdate(from, 'not_announcement')
            textImg("*Group Dibuka Oleh Admin:* " + pushname)
        } else if (q==="close") {
            await funka.groupSettingUpdate(from, 'announcement')
            textImg("*Group Ditutup Oleh Admin:* " + pushname)
        } else {
            textImg(ind.wrongFormat(prefix))
    }
    break
    case prefix+'hidetag':
        if (!isGroup) return textImg(ind.groupOnly())
        if (isGroupAdmins || isOwner) {
            funka.sendMessage(from, { text : q ? q : '' , mentions: groupMembers.map(a => a.id)})
        } else {
            textImg(ind.adminsOnly())
    }
    break
    //=====[ ANIME ]=====\\
    case prefix+"anime":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Anime", `Request : ${pushname}`, msg)
        try {
            const getanime = await hxz.otakudesu(q)
            let c = `╭「 *ANIME* 」\n├ *Judul:* ${getanime.jepang}\n├ *Rate:* ${getanime.rate}\n├ *Producer:* ${getanime.producer}\n├ *Status:* ${getanime.status}\n├ *Last Eps:* ${getanime.episode}\n├ *Release:* ${getanime.rilis}\n├ *Studio:* ${getanime.studio}\n├ *Genre:* ${getanime.genre}\n└ *Description:* ${getanime.desc}`
            sendFileFromUrl(from, getanime.img, c)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))
    }
    break
    case prefix+"manga":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Manga", `Request : ${pushname}`, msg)
        try {
            const getmanga = await xfar.Manga(q)
            let hajdhsdjask = `╭「 *MANGA* 」\n`
        for (audhjd of getmanga) {
            hajdhsdjask += `├ *Judul:* ${audhjd.judul}\n`
            hajdhsdjask += `└ *Link:* ${audhjd.link}\n\n`
        }
            sendFileFromUrl(from, getmanga[0].thumbnail, hajdhsdjask)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"character":
    case prefix+"chara":
    case prefix+"char":    
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Character", `Request : ${pushname}`, msg)
        try {
            const getchar = await hxz.chara(q)
        for (let i = 0; i < 3;i++) {
            sendFileFromUrl(from, getchar[i], `*${q}*`)
          }
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))
    }
    break
    case prefix+"waifu":
        await adReply(ind.wait(), "Waifu", `Request : ${pushname}`, msg)
        try {
            const {data} = await axios.get("https://api.waifu.im/sfw/waifu/?exclude=3867126be8e260b5.jpeg,ca52928d43b30d6a&gif=false")
            sendFileFromUrl(from, data.images[0].url, data.images[0].tags[0].description)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))
    }
    break
    //=====[ SEARCH ]=====\\
    case prefix+"film":
    case prefix+"movie":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Movie", `Request : ${pushname}`, msg)
        try {
            const getfilm = await xfar.Film(q)
            let ahgsdash = `╭「 *MOVIE* 」\n`
        for (audhjd of getfilm) {
            ahgsdash += `├ *Judul:* ${audhjd.judul}\n`
            ahgsdash += `├ *Quality:* ${audhjd.quality}\n`
            ahgsdash += `├ *Type:* ${audhjd.type}\n`
            ahgsdash += `├ *Date:* ${audhjd.upload}\n`
            ahgsdash += `└ *Link:* ${audhjd.link}\n\n`
        }
            sendFileFromUrl(from, getfilm[0].thumb, ahgsdash)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"lirik":
    case prefix+"lyrics":
    case prefix+"lyric":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Lyrics", `Request : ${pushname}`, msg)
        try {
            const {data} = await axios.get("https://www.lyricsfreak.com/search.php?a=search&q="+q)
            let $ = cheerio.load(data)
            let h1 = $('.song');
            const hh = h1.attr('href')
            const huu = await axios.get('https://www.lyricsfreak.com' + hh)
            let s = cheerio.load(huu.data)
            let h2 = s('.lyrictxt').text();
            textImg(`╭「 *LIRIK* 」\n└${h2}`)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))
    }
    break
    case prefix+"wattpad":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Wattpad", `Request : ${pushname}`, msg)
        try {
            const getwp = await xfar.Wattpad(q)
            let hajdhsdjasks = `╭「 *WATTPAD* 」\n`
        for (audhjds of getwp) {
            hajdhsdjasks += `├ *Judul:* ${audhjds.judul}\n`
            hajdhsdjasks += `├ *Read:* ${audhjds.dibaca}\n`
            hajdhsdjasks += `├ *Rating:* ${audhjds.divote}\n`
            hajdhsdjasks += `├ *Link:* ${audhjds.url}\n`
            hajdhsdjasks += `└ *Desc:* ${audhjds.description}\n\n`
        }
            sendFileFromUrl(from, getwp[0].thumb, hajdhsdjasks)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"webtoon":
    case prefix+"webtoons":  
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Webtoon", `Request : ${pushname}`, msg)
        try {
            const getwt = await xfar.Webtoons(q)
            let hajdhsdjaskp = `╭「 *WEBTOON* 」\n`
        for (audhjds of getwt) {
            hajdhsdjaskp += `├ *Judul:* ${audhjds.judul}\n`
            hajdhsdjaskp += `├ *like:* ${audhjds.like}\n`
            hajdhsdjaskp += `├ *Creator:* ${audhjds.creator}\n`
            hajdhsdjaskp += `├ *Genre:* ${audhjds.genre}\n`
            hajdhsdjaskp += `└ *Link:* ${audhjds.url}\n\n`
        }
            textImg(hajdhsdjaskp)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"drakor":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Drakor", `Request : ${pushname}`, msg)
        try {
            const getdr = await xfar.Drakor(q)
            let hajdhsdjaska = `╭「 *DRAKOR* 」\n`
            for (audhjds of getdr) {
            hajdhsdjaska += `├ *Judul:* ${audhjds.judul}\n`
            hajdhsdjaska += `├ *Tahun:* ${audhjds.years}\n`
            hajdhsdjaska += `├ *Genre:* ${audhjds.genre}\n`
            hajdhsdjaska += `└ *Link:* ${audhjds.url}\n\n`
        }
            sendFileFromUrl(from, getdr[0].thumbnail, hajdhsdjaska)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"pinterest":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Pinterest", `Request : ${pushname}`, msg)
        try {
            const pin = await pinterest(q)
            let pilih = await Math.floor(Math.random()*pin.length)
            let cap = await short(pin[pilih])
            sendFileFromUrl(from, pin[pilih], cap)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"gcsearch":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Gc Search", `Request : ${pushname}`, msg)
        try {
        if (!isGroup) {
            let getgc = await hxz.linkwa(q)
            let fgashghfgasjfn = `╭「 *GROUP SEARCH* 」`
        for (sjka of getgc) {
            fgashghfgasjfn += `├ *Name:* ${sjka.nama} \n`
            fgashghfgasjfn += `└ *Link:* ${sjka.link} \n\n`
        }
        textImg(fgashghfgasjfn)} else {
            textImg("Result akan dikirim ke private chat untuk menghindari antilink")
            let getgc = await hxz.linkwa(q)
            let fgashghfgasjfn = `┌──「 *G R O U P* 」\n│\n`
        for (sjka of getgc) {
            fgashghfgasjfn += `├ *Name:* ${sjka.nama} \n`
            fgashghfgasjfn += `└ *Link:* ${sjka.link} \n\n`
        }
            funka.sendMessage(sender, {text: fgashghfgasjfn}, {quoted: msg})
          }
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"igstalk":
    case prefix+"instagramstalk":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "IG Stalk", `Request : ${pushname}`, msg)
        try {
            const getigstalk = await igstalk(q)
            let cap = `╭「 *IG STALK* 」\n`
            cap += `├ *Username:* ${q} \n`
            cap += `├ *Fullname:* ${getigstalk.graphql.user.full_name} \n`
            cap += `├ *Followers:* ${getigstalk.graphql.user.edge_followed_by.count} \n`
            cap += `├ *Following:* ${getigstalk.graphql.user.edge_follow.count} \n`
            cap += `├ *Private:* ${getigstalk.graphql.user.is_private ? "Private" : "Not Private"} \n`
            cap += `└ *Bio:* ${getigstalk.graphql.user.biography ? getigstalk.graphql.user.biography : "Tidak Ada"}`
            sendFileFromUrl(from, getigstalk.graphql.user.profile_pic_url_hd, cap)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    //=====[ MEDIA ]=====\\
    case prefix+"toimg":
        if (!isQuotedSticker) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Sticker To Image", `Request : ${pushname}`, msg)
            let rand = await Math.floor(Math.random()*7613786)
            var rand1 = rand+'.webp' 
            let buffer = await downloadAndSaveMediaMessage("sticker", "./"+rand1)
            var rand2 = rand+'.png'			   
            fs.writeFileSync(`./${rand1}`, buffer)
        if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
            exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
            fs.unlinkSync(`./${rand1}`)
        if (err) return textImg(err)
            funka.sendMessage(from, { image: fs.readFileSync(`${rand2}`) }, { quoted: msg })
            fs.unlinkSync(`${rand2}`)
          })
        } else {
    }
    break
    case prefix+"sticker":
    case prefix+"stiker":
    case prefix+"s":
        if (isImage || isQuotedImage) {
        await adReply(ind.wait(), "Sticker", `Request : ${pushname}`, msg)
            let file = await downloadAndSaveMediaMessage("image", "temp/"+sender+".png")
        let sticker = new Sticker(file, {
            pack: stickerInfo.pack,
            author: stickerInfo.author,
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 75,
            background: 'transparent'
        })
            const buffer = await sticker.toBuffer()
            funka.sendMessage(from, {sticker: buffer}, {quoted: msg})

        } else if(isVideo || isQuotedVideo) {
        await adReply(ind.wait(), "Sticker", `Request : ${pushname}`, msg)
            if (isQuotedVideo ? msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds > 15 : msg.message.videoMessage.seconds > 15) return textImg('too long duration, max 15 seconds')
            let file = await downloadAndSaveMediaMessage("video", "./temp/"+sender+".mp4")
            let ahsuhfkj = await convert("./temp/"+sender+".mp4")
            let sticker = new Sticker(fs.readFileSync(ahsuhfkj), {
            pack: stickerInfo.pack,
            author: stickerInfo.author,
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 75,
            background: 'transparent'
        })
            const stikk = await sticker.toBuffer() 
            funka.sendMessage(from, {sticker: stikk}, {quoted: msg})
        } else {
             textImg("Reply Gambar Atau Video!")
    }
    break
    case prefix+"ocr":
        try {
        if (isImage) {
        await adReply(ind.wait(), "OCR", `Request : ${pushname}`, msg)
            let media = await downloadAndSaveMediaMessage("image", "temp/ocr.png")
            const asjfhasjkfhasji = await tesseract
            .recognize(media, configocr)
            textImg(asjfhasjkfhasji)
        } else if(isQuotedImage) {
        await adReply(ind.wait(), "OCR", `Request : ${pushname}`, msg)
            let media = await downloadAndSaveMediaMessage("image", "temp/ocr.png")
            const asjfhasjkfhasjia = await tesseract
            .recognize(media, configocr)
            textImg(asjfhasjkfhasjia)
            }
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))
    }
    break
    //=====[ MAKER ]=====\\
    case prefix+"carbon":
    case prefix+"code":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Carbon Now-Sh", `Request : ${pushname}`, msg)
        try {
            const carbon = new Carbon.createCarbon()
            .setCode(q).setBackgroundColor('#1b3648')
            const bufferr =  await Carbon.generateCarbon(carbon) 
            funka.sendMessage(from, {image: bufferr}, {quoted: msg})
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))
    }
    break
    //=====[ DOWNLOAD ]=====\\
    case prefix+"tiktok":
    case prefix+"tik":
    case prefix+"tt":
    case prefix+"ttdl":
        if (!q) return textImg(ind.wrongFormat(prefix))
        if (!isUrl) return textImg(ind.noUrl())
            await adReply(ind.wait(), "Tiktok", `Request : ${pushname}`, msg)
        try {
            const gettt = await hxz.ttdownloader(q)
            sendFileFromUrl(from, gettt.nowm, `*Request:* ${pushname}`, msg)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"ytmp3":
    case prefix+"mp3":
        if (!q) return textImg(ind.wrongFormat(prefix))
        if (!isUrl) return textImg(ind.noUrl())
        await adReply(ind.wait(), "Youtube Mp3", `Request : ${pushname}`, msg)
        try {
            const getmp3 = await xfar.Youtube(q)
            let sifugtgfrasdjkfhsdj = `╭「 *YTMP3* 」\n├ *Title:* ${getmp3.title}\n├ *Duration:* ${getmp3.duration}\n└ *Size:* ${getmp3.medias[7].formattedSize}`
            sendFileFromUrl(from, getmp3.thumbnail, sifugtgfrasdjkfhsdj, msg)
            sendFileFromUrl(from, getmp3.medias[7].url, sifugtgfrasdjkfhsdj, msg)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"ytmp4":
    case prefix+"mp4":
        if (!q) return textImg(ind.wrongFormat(prefix))
        if (!isUrl) return textImg(ind.noUrl())
        await adReply(ind.wait(), "Youtube Mp4", `Request : ${pushname}`, msg)
        try {
            const getmp4 = await xfar.Youtube(q)
            let asjdghfashgfashgf = `╭「 *YTMP4* 」\n├ *Title:* ${getmp4.title}\n├ *Duration:* ${getmp4.duration}\n└ *Size:* ${getmp4.medias[1].formattedSize}`
            sendFileFromUrl(from, getmp4.thumbnail, asjdghfashgfashgf, msg)
            sendFileFromUrl(from, getmp4.medias[1].url, asjdghfashgfashgf, msg)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"yts":
    case prefix+"ytsearch":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Youtube Search", `Request : ${pushname}`, msg)
        try {
            const getyts = await yts(q)
            let afhasuyduytsduyt = `╭「 *YT SEARCH* 」\n`
        for (i of getyts.all) {
            afhasuyduytsduyt += `├ *Title:* ${i.title}\n`
            afhasuyduytsduyt += `└ *Url* ${i.url}\n\n`
        }
            sendFileFromUrl(from, getyts.all[0].image, afhasuyduytsduyt)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))    
    }
    break
    case prefix+"play":
    case prefix+"ytplay":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Youtube Play", `Request : ${pushname}`, msg)
        try {
            const waitget = await  yts(q)
            const getplay = await xfar.Youtube(waitget.all[0].url)
            let ashgasfgashfash = `╭「 *PLAY* 」\n├ *Title:* ${getplay.title}\n├ *Duration:* ${getplay.duration}\n└ *Size:* ${getplay.medias[7].formattedSize}`
            sendFileFromUrl(from, getplay.thumbnail, ashgasfgashfash, msg)
            sendFileFromUrl(from, getplay.medias[7].url, ashgasfgashfash, msg)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))  
    }
    break
    case prefix+"fb":
    case prefix+"facebook":
        if (!q) return textImg(ind.wrongFormat(prefix))
        if (!isUrl) return textImg(ind.noUrl())
        await adReply(ind.wait(), "Facebook", `Request : ${pushname}`, msg)
        try {
            const getfb = await xfar.Facebook(q)
            let abdvhjasdashjh = `╭「 *FACEBOOK* 」\n├ *Title:* ${getfb.title}\n├ *Type:* ${getfb.medias[0].extension}\n└ *Quality:* ${getfb.medias[0].quality}`
            sendFileFromUrl(from, getfb.medias[0].url, abdvhjasdashjh, msg)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))  
    }
    break
    case prefix+"twitter":
    case prefix+"twiter":
    case prefix+"twt":
        if (!q) return textImg(ind.wrongFormat(prefix))
        if (!isUrl) return textImg(ind.noUrl())
        await adReply(ind.wait(), "Twitter", `Request : ${pushname}`, msg)
        try {
            const gettwt = await xfar.Twitter(q)
            sendFileFromUrl(from, gettwt.medias[1].url,txt,msg)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))  
    }
    break
    case prefix+"ig": 
    case prefix+"igdl":
    case prefix+"instagram":
        if (!q) return textImg(ind.wrongFormat(prefix))
        if (!isUrl) return textImg(ind.noUrl())
        await adReply(ind.wait(), "Instagram ", `Request : ${pushname}`, msg)
        try {
            const getig = await hxz.igdl(q)
            let gasdfghasfghasfy = `*Request By:* ${pushname}`
        for (i of getig.medias) {
        if (i.type == 'video') {
            funka.sendMessage(from, {video: {url: i.downloadUrl}, caption: gasdfghasfghasfy}, {quoted: msg})
        } else {
            funka.sendMessage(from, {image: {url: i.downloadUrl}, caption: gasdfghasfghasfy}, {quoted: msg})		
           }
         }
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))  
    }
    break
    case prefix+"tr":
    case prefix+"translate":
        if (!q) return textImg(ind.wrongFormat(prefix))
        await adReply(ind.wait(), "Translate", `Request : ${pushname}`, msg)
        try {
            const trs = await translate(q.slice(2), {to: q.split(" ")[0]})
            textImg(trs)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))  
    }
    break
    case prefix+"gempa":
        await adReply(ind.wait(), "BMKG Gempa", `Request : ${pushname}`, msg)
        try {
            const {data} = await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json")
            let asbnfvashfgyjas = `╭「 *GEMPA* 」\n├ *TimeStamp:* ${data.Infogempa.gempa.Tanggal}\n├ *Time:* ${data.Infogempa.gempa.Jam}\n├ *Coordinates:* ${data.Infogempa.gempa.Coordinates}\n├ *Magnitude:* ${data.Infogempa.gempa.Magnitude}\n├ *Depth:* ${data.Infogempa.gempa.Kedalaman}\n├ *Region:* ${data.Infogempa.gempa.Wilayah}\n├ *Potention:* ${data.Infogempa.gempa.Potensi}\n└ *Effect:* ${data.Infogempa.gempa.Dirasakan}`
            sendFileFromUrl(from, "https://data.bmkg.go.id/DataMKG/TEWS/"+data.Infogempa.gempa.Shakemap, asbnfvashfgyjas)
        } catch (err) {
            textImg(ind.err(chats.split(" ")[0].split(prefix)[1], err))
    }
    break
    //=====[ TAMAT ]=====\\
  }
} catch (err) {
console.log(color('[ERR]', 'red'), color(err, 'cyan'))
    }
}
