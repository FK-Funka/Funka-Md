exports.wait = () => {
   return ("Mohon tunggu sebentar~")
}

exports.rules = (prefix) => {
    return `
╭「 *RULES* 」
├ Jangan spam bot
├ Jangan telepon bot
├ Jangan mengeksploitasi bot
└ Jika Melanggar Akan Banned+Block

Note : 
Bot Ini Masih Beta
Jika Tidak Respon Chat Pribadi Saja
`
}

exports.wrongFormat = (prefix) => {
    return `Format salah...\nSilahkan cek di ${prefix}menu`
}

exports.rent = () => {
    return `
╭「 *SEWA BOT* 」
├ *2 Minggu:* Rp.15.000
└ *1 Bulan:* Rp.25.000

Jika Minat Hubungi Owner
https://wa.me/6283818221226
`
}
exports.donate = () => {
return `╭「 *DONATE* 」
├ *Pulsa:* 6283818221226 (+5k)
└ Atau Beli Paket Axis Aja Terserah Mau Berapa
`
}

exports.getGroupAdmins = function(participants){
    let admins  = []
	for (let i of participants) {
		i.admin  !== null ? admins.push(i.id) : ''
	}
	return admins
}

exports.groupOnly = function(){
    return "Fitur Khusus Group!"
}

exports.adminsOnly = function(){
    return "Fitur Khusus Admin Group!"
}

exports.err = (cmd, err) => {
    return `Error ${cmd}: ${err}`
}

exports.noUrl = () => {
    return "Input Harus Berupa Url!"
}