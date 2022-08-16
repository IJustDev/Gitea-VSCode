import { Issue } from './issue';

export function showIssueHTML(issue: Issue) {
  return `<body>
    <h1>{{label}}</h1>
    <table>
      <tr>
        <td>
          Title
        </td>
        <td >
          {{label}}
        </td>
      </tr>
      <tr>
        <td>
          State
        </td>
        <td>
          {{state}}
        </td>
      </tr>
      <tr >
        <td>
          Assignee
        </td>
        <td>
          {{assignee}}
        </td>
      </tr>
    </table>
    <p style="font-size: 20pt">
      {{description}}
    </p>
    </body>
  `
    .replace('{{label}}', issue.label)
    .replace('{{state}}', issue.state)
    .replace('{{assignee}}', issue.assignee)
    .replace('{{description}}', issue.body)
    .replace('{{label}}', issue.label);
}


export function showIssueMD(issue: Issue) {
    return `# {{title}} (#{{id}})

{{description}}

---

* State: {{state}}
* Assignee: {{assignee}}
* [See in browser]({{html_url}})
    `
    .replace('{{title}}', issue.title)
    .replace('{{id}}', issue.issueId.toString())
    .replace('{{description}}', issue.body)
    .replace('{{state}}', issue.state)
    .replace('{{assignee}}', issue.assignee)
    .replace('{{html_url}}', issue.html_url)
  }
