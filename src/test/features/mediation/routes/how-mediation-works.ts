import { expect } from 'chai'
import * as request from 'supertest'
import * as config from 'config'

import { attachDefaultHooks } from 'test/routes/hooks'
import 'test/routes/expectations'
import { checkAuthorizationGuards } from 'test/common/checks/authorization-check'

import { Paths as MediationPaths } from 'mediation/paths'

import { app } from 'main/app'

import * as idamServiceMock from 'test/http-mocks/idam'
import * as draftStoreServiceMock from 'test/http-mocks/draft-store'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'

import { checkCountyCourtJudgmentRequestedGuard } from 'test/common/checks/ccj-requested-check'
import { FeatureToggles } from 'utils/featureToggles'

const cookieName: string = config.get<string>('session.cookieName')
const pagePath = MediationPaths.howMediationWorksPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })

if (FeatureToggles.isEnabled('mediation')) {
  describe('Mediation: how mediation works page', () => {
    attachDefaultHooks(app)

    describe('on GET for defendant', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
        })

        checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

        context('when response not submitted', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('How free mediation works'))
          })
        })
      })
    })

    describe('on GET for claimant', () => {
      const method = 'get'
      checkAuthorizationGuards(app, method, pagePath)

      context('when user authorised', () => {
        beforeEach(() => {
          idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
        })

        checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)

        context('when response not submitted', () => {
          it('should return 500 and render error page when cannot retrieve claim', async () => {
            claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error')

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.serverError.withText('Error'))
          })

          it('should render page when everything is fine', async () => {
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('response')
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()

            await request(app)
              .get(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.successful.withText('How free mediation works'))
          })
        })
      })
    })

    describe('on POST', () => {
      const method = 'post'
      checkAuthorizationGuards(app, method, pagePath)

      context('when user authorised', () => {
        context('when form is valid', () => {
          it('should redirect to free mediation page when everything is fine for the defendant', async () => {
            idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen')
            checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect
                .toLocation(MediationPaths.willYouTryMediation.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })

          it('should redirect to the free mediation page when everything is fine for the claimant', async () => {
            idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen')
            checkCountyCourtJudgmentRequestedGuard(app, method, pagePath)
            claimStoreServiceMock.resolveRetrieveClaimByExternalId()
            draftStoreServiceMock.resolveFind('mediation')
            draftStoreServiceMock.resolveFind('response')

            await request(app)
              .post(pagePath)
              .set('Cookie', `${cookieName}=ABC`)
              .expect(res => expect(res).to.be.redirect
                .toLocation(MediationPaths.willYouTryMediation.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })))
          })
        })
      })
    })
  })
}
