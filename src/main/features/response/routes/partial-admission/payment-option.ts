import * as express from 'express'

import { partialAdmissionPath } from 'response/paths'
import { PaymentOptionPage } from 'response/components/payment-intention/payment-option'
import { FeatureToggleGuard } from 'guards/featureToggleGuard'
import { ResponseDraft } from 'response/draft/responseDraft'

const setHowMuchDoYouOweAmount = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const draft: ResponseDraft = res.locals.responseDraft.document

  if (draft.isResponsePartiallyAdmitted() && draft.partialAdmission.howMuchDoYouOwe) {
    res.locals.amount = draft.partialAdmission.howMuchDoYouOwe.amount || 0
  }

  next()
}

/* tslint:disable:no-default-export */
export default new PaymentOptionPage('partialAdmission')
  .buildRouter(partialAdmissionPath, FeatureToggleGuard.featureEnabledGuard('admissions'), setHowMuchDoYouOweAmount)