const args = process.argv.slice(2);

function printWelcome() {
  console.log(`
    Search the most starred repositories on GitHub within a defined date range !
    
    To see the usage, type "node . help"`);
}

function printHelp() {
  console.log(`
    Usage :
      node . <start_date>       
        | Prints the most starred repositories created from the specified date onwards

      node . <start_date> <end_date>
        | Prints the most starred repositories created between the two specified dates
        
      date format : YYYY-MM-DD    Example : 2nd, June 2024 = 2024-06-02
  `);
}

function parseArguments(args) {
  const options = {};

  if (args.length === 0) {
    options.welcome = true;
  }

  if (args[0] === "help") {
    options.help = true;
  } else {
    options.startDate = args[0];
  }

  options.endDate = args[1];

  return options;
}

async function main() {
  const options = parseArguments(args);

  let query = {
    dateRange: "",
    content: ``,
  };

  function updateQueryContent() {
    query.content = `q=created:${query.dateRange}&sort=stars&order=desc`;
  }

  if (options.welcome) {
    printWelcome();
  }

  if (options.help) {
    printHelp();
  }

  if (options.startDate && options.endDate) {
    query.dateRange += `${options.startDate}..${options.endDate}`;
  } else if (options.startDate) {
    query.dateRange += `>=${options.startDate}`;
  }
  updateQueryContent();

  if (query.dateRange !== "") {
    const response = await fetch(
      `https://api.github.com/search/repositories?${query.content}`
    );
    const result = await response.json();
    console.log(`
      Found ${result.total_count} repositories.
      
      ${result.items.map((item, index) => {
        return `\t ${index + 1}. ${item.name} by ${item.owner.login} (${
          item.stargazers_count
        } stars): ${item.html_url} \n`;
      })}`);
  } else if (!options.help && !options.welcome) {
    console.log("Error : query incomplete");
  }
}

main();
