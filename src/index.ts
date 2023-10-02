const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit"
}

type InquirerAnswers = {
  action: Action
}

enum MessageVariant {
  Success = "success",
  Error = "error",
  Info = "info",
}

const startApp = () => {
  inquirer
    .prompt([
      {
        name: 'action',
        type: 'input',
        message: 'How can I help you?',
    },
  ])
  .then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        case Action.List:
          users.showAll();
          startApp();
          break;
        case Action.Add:
          const user = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }, {
            name: 'age',
            type: 'number',
            message: 'Enter age',
          }]);
          users.add(user);
          startApp();
          break;
        case Action.Remove:
          const name = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }]);
          users.remove(name.name);
          startApp();
          break;
        case Action.Quit:
          Message.showColorized(MessageVariant.Info, "Bye bye !");
          return;

        default:
          Message.showColorized(
            MessageVariant.Error,
            'Command not found. Please enter a valid command (add/list/remove/quit).'
          );
          startApp();
          break;
      }
  });
}

class Message {

	constructor(private content: string) {
		this.content = content;
	}

	public show() {
		console.log(this.content)
	}

	capitalize() {
		this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();
	}

 toUpperCase() {
		this.content = this.content.toUpperCase();
	}

	toLowerCase() {
		this.content = this.content.toLowerCase();
	}

	public static showColorized(variant: MessageVariant, text: string): void {
    if (variant === MessageVariant.Success) {
      consola.success(text);
    } else if (variant === MessageVariant.Error) {
      consola.error(text);
    } else if (variant === MessageVariant.Info) {
      consola.info(text);
    } else {
      consola.info(text);
    }
  }
}

interface User {
	name: string,
	age: number
}

class UsersData {
	private data: User[] = [];

	showAll(): void {
    Message.showColorized(MessageVariant.Info, 'Users data');
    if (this.data.length > 0) {
      console.table(this.data);
    } else {
      Message.showColorized(MessageVariant.Error, 'No data...');
    }
  }

	public add(user: User) {
		if ( user.age > 0 && user.name.length > 0 ) {
			this.data.push(user);
			Message.showColorized(MessageVariant.Success, 'User has been successfully added!');
		} else {
			Message.showColorized(MessageVariant.Error, 'Wrong data!');
		}
	}

	public remove(name: string) {
		const index = this.data.findIndex(user => user.name === name);
		if (index !== -1) {
			this.data.splice(index, 1);
			Message.showColorized(MessageVariant.Success, 'User deleted!');
		} else {
			Message.showColorized(MessageVariant.Error, 'User not found...')
		}
	}

}


const users = new UsersData();

// Display welcome messages and available actions.
console.log("\n");
console.info("----- Welcome to the UsersApp! -----");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add a new user to the list");
console.log("remove – remove a user from the list");
console.log("quit – quit the app");
console.log("\n");

startApp();

