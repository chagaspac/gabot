const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth');

var perguntas = [];
const TEACHER_ROLE = 'Staff';
const PREFIX_COMMAND = '!';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    var message = msg.content;
    var isCommand = message.trim().substring(0, PREFIX_COMMAND.length) == PREFIX_COMMAND && message.length > 1 ? true : false;
    if (isCommand) {
        var command = message.slice(PREFIX_COMMAND.length, message.length).trim();
        var rolesOfUser = msg.member.roles;
        var isStaff = msg.member.roles.find((r) => { return r.name == TEACHER_ROLE;}) == null ? false : true;
        
        switch (command.toLowerCase()) {
            case 'pergunta': case 'eu':
            var user = msg.author;
            var userOnArray = perguntas.find((u) => { return u.user == user.username; });
            if (userOnArray == undefined) {
                perguntas.push({ user: user.username });
                console.log('Entrou o ' + user.username + ' na fila (' + perguntas.length + ')');
                var str = "Você está na fila, agora senta e espera o professor te chamar :smile: :smile: :smile:\nA ordem da fila é essa: ";
                perguntas.forEach(item=>{
                    str += "\n -" + item.user
                });
                msg.reply(str);
            } else {
                msg.reply("Você já está na fila :rage: ");
            }
            break;
            case 'proximo':
            if (!isStaff){
                msg.reply("Você não tem permissão para isso...");
            } else {
                if (perguntas.length == 0) {
                    msg.reply("Não tem ninguém na fila!");
                } else {
                    var str = "Agora é a vez do " + perguntas.shift().user;
                    console.log('Saiu 1 da fila (' + perguntas.length + ')');
                    if(perguntas.length > 0){
                        str += "\nEstão faltando: ";
                    }
                    perguntas.forEach(item => {
                        str += "\n -" + item.user
                    });
                    msg.reply(str);
                }
            }
            break;
            case 'limpartudo': case 'limpar': case 'clear':
            if (!isStaff) {
                msg.reply("Você não tem permissão para isso...");
            } else {
                perguntas = [];
                msg.reply("Lista de perguntas limpa :ok_hand:");
            }
            break;
            case 'help':
            msg.reply("Eis o que você pode me pedir:\n:point_right: !pergunta/!eu - Você entra na fila para perguntar\n:point_right: !proximo - Passa a vez para o próximo perguntar\n:point_right: !limpartudo/!limpar/!clear - Limpar toda a lista de perguntas\n");
            break;
            default:
            msg.reply("Não entendi o que você quis dizer :rolling_eyes:");
            break;
        }
    }
});

client.login(auth.token);