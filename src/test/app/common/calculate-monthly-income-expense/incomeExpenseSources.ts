import { expect } from 'chai'
import { IncomeExpenseSources } from 'common/calculate-monthly-income-expense/incomeExpenseSources'
import { IncomeExpenseSource } from 'common/calculate-monthly-income-expense/incomeExpenseSource'
import { IncomeExpenseSchedule } from 'common/calculate-monthly-income-expense/incomeExpenseSchedule'
import { ExpenseSchedule } from 'response/form/models/statement-of-means/expenseSchedule'
import { Validator } from 'class-validator'
import { expectValidationError } from '../../forms/models/validationUtils'
import { ValidationErrors as GlobalValidationErrors } from 'forms/validation/validationErrors'
import { MonthlyIncome, SourceNames } from 'response/form/models/statement-of-means/monthlyIncome'
import { IncomeSource } from 'response/form/models/statement-of-means/incomeSource'

const SAMPLE_INCOME_EXPENSE_SOURCES_FROM_OBJECT = {
  incomeExpenseSources: [
    {
      'amount': 100,
      'schedule': IncomeExpenseSchedule.MONTH.value
    }
  ]
}

describe('IncomeExpenseSources', () => {
  describe('fromObject', () => {

    it('should return undefined when undefined provided as object parameter', () => {
      expect(IncomeExpenseSources.fromObject(undefined)).to.eql(undefined)
    })

    it('should return undefined when no object parameter provided', () => {
      expect(IncomeExpenseSources.fromObject()).to.deep.equal(undefined)
    })

    it('should throw invalid array error when an empty object parameter is provided', () => {
      expect(() => IncomeExpenseSources.fromObject({})).to.throw(Error, 'Invalid value: missing array')
    })

    it('should return a new instance initialised with defaults when an empty incomeExpenseSources array is provided', () => {
      expect(IncomeExpenseSources.fromObject({ incomeExpenseSources: [] })).to.deep.equal(new IncomeExpenseSources([]))
    })

    it('should throw invalid array error when incomeExpenseSources provided is not an array', () => {
      expect(() => IncomeExpenseSources.fromObject({ incomeExpenseSources: 'not an array' })).to.throw(Error, 'Invalid value: missing array')
    })

    it('should return a new instance initialised with set fields from object parameter provided', () => {
      expect(IncomeExpenseSources.fromObject(SAMPLE_INCOME_EXPENSE_SOURCES_FROM_OBJECT)).to.deep.equal(
        new IncomeExpenseSources(
          [
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.MONTH
            }
          ]
        )
      )
    })

  })

  describe('fromFormModel', () => {
    it('should return a new instance initialised with set fields from object parameter provided', () => {
      const monthlyIncome: MonthlyIncome = new MonthlyIncome(
        undefined, new IncomeSource(SourceNames.SALARY, 100, ExpenseSchedule.MONTH),
        undefined, new IncomeSource(SourceNames.UNIVERSAL_CREDIT, 200, ExpenseSchedule.MONTH),
        undefined, new IncomeSource(SourceNames.JOBSEEKER_ALLOWANCE_INCOME, 300, ExpenseSchedule.TWO_WEEKS),
        undefined, new IncomeSource(SourceNames.JOBSEEKER_ALLOWANCE_CONTRIBUTION, 400, ExpenseSchedule.MONTH),
        undefined, new IncomeSource(SourceNames.INCOME_SUPPORT, 500, ExpenseSchedule.MONTH),
        undefined, new IncomeSource(SourceNames.WORKING_TAX_CREDIT, 600, ExpenseSchedule.TWO_WEEKS),
        undefined, new IncomeSource(SourceNames.CHILD_TAX_CREDIT, 700, ExpenseSchedule.MONTH),
        undefined, new IncomeSource(SourceNames.CHILD_BENEFIT, 800, ExpenseSchedule.MONTH),
        undefined, new IncomeSource(SourceNames.COUNCIL_TAX_SUPPORT, 900, ExpenseSchedule.TWO_WEEKS),
        undefined, new IncomeSource(SourceNames.PENSION, 100, ExpenseSchedule.TWO_WEEKS)
      )

      expect(IncomeExpenseSources.fromFormModel(monthlyIncome)).to.deep.equal(
        new IncomeExpenseSources(
          [
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 200,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 300,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 400,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 500,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 600,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 700,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 800,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 900,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            },
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.TWO_WEEKS
            }
          ]
        )
      )
    })
  })

  describe('validation', () => {
    const validator: Validator = new Validator()

    describe('when not successful', () => {

      it('should return an error when `incomeExpenseSources` is undefined', () => {
        const errors = validator.validateSync(new IncomeExpenseSources(undefined))

        expect(errors.length).to.equal(1)
        expectValidationError(errors, 'incomeExpenseSources must be an array')
      })

      it('should return an error when `incomeExpenseSources` is invalid', () => {
        const invalidIncomeExpenseSource = new IncomeExpenseSource(undefined, IncomeExpenseSchedule.MONTH)
        const errors = validator.validateSync(new IncomeExpenseSources([invalidIncomeExpenseSource]))

        expect(errors.length).to.equal(1)
        expectValidationError(errors,
          GlobalValidationErrors.NUMBER_REQUIRED &&
          GlobalValidationErrors.POSITIVE_NUMBER_REQUIRED)
      })

      describe('when successful', () => {
        it('should return no error when `incomeExpenseSources` is valid', () => {
          const errors = validator.validateSync(new IncomeExpenseSources([
            {
              'amount': 100,
              'schedule': IncomeExpenseSchedule.MONTH
            },
            {
              'amount': 200,
              'schedule': IncomeExpenseSchedule.WEEK
            }
          ]))
          expect(errors.length).to.equal(0)
        })

        it('should return no error when `incomeExpenseSources` is an empty array', () => {
          const errors = validator.validateSync(new IncomeExpenseSources([]))
          expect(errors.length).to.equal(0)
        })
      })
    })
  })
})