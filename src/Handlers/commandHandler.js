const path = require('node:path');
const fs = require('node:fs');
const { REST, Routes } = require('discord.js');

const commands = [];

module.exports = (client) => {
  const commandsPath = path.join(__dirname, '../Commands');
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const rest = new REST().setToken(process.env.TOKEN);

  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);

      const data = await rest.put(
        Routes.applicationGuildCommands('1292959975479709748', '1102771347920277516'),
        {
          body: commands,
        }
      );
      // const data = await rest.put(
      //   Routes.applicationCommands('1292959975479709748'),
      //   {
      //     body: commands,
      //   }
      // );

      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
      console.error(error);
    }
  })();
};
