import I = CodeceptJS.I
import { DateParser } from 'integration-test/utils/date-parser'

const I: I = actor()

const fields = {
  day: { css: 'input[id="respiteStart[day]"]' },
  month: { css: 'input[id="respiteStart[month]"]' },
  year: { css: 'input[id="respiteStart[year]"]' }
}

const buttons = {
  submit: { css: 'input[type=submit]' }
}

export class WhenDidBsStartPage {

  enterBsStartDate (dob: string): void {
    const [ year, month, day ] = DateParser.parse(dob)

    I.fillField(fields.day, day)
    I.fillField(fields.month, month)
    I.fillField(fields.year, year)

    I.click(buttons.submit)
  }
}
