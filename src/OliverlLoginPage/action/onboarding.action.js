import { onboardingServices } from '../';
import { onboardingConstants } from '../'
import { alertActions } from "../../_actions";
import { history } from "../../_helpers";
import moment from 'moment';
import LocalizedLanguage from '../../settings/LocalizedLanguage'
import { data } from 'jquery';

export const onboardingActions = {
  OliverExternalLogin,
  GetUserProfile,
};

function OliverExternalLogin(exteralLoginParam) {
  return dispatch => {
    dispatch(request({ exteralLoginParam }));
    onboardingServices
      .OliverExternalLogin(exteralLoginParam)
      .then(
        data => {
          console.log('----success---action--', data);
          dispatch(success(data));

        },
        error => {
          console.log('----action--error-', error);
          dispatch(failure(error.toString()));
        }
      );
  }
  function request(user) { return { type: onboardingConstants.OLIVER_LOGIN_REQUEST, user } }
  function success(oliverExternalLoginRes) { return { type: onboardingConstants.OLIVER_LOGIN_SUCCESS, oliverExternalLoginRes }; }
  function failure(error) { return { type: onboardingConstants.OLIVER_LOGIN_FAILURE, error }; }
}

function GetUserProfile(profileGetParam) {
  return dispatch => {
    dispatch(request({ profileGetParam }));
    onboardingServices
      .GetUserProfile(profileGetParam)
      .then(
        data => {
          console.log('----success---action--', data);
          dispatch(success(data));

        },
        error => {
          console.log('----action--error-', error);
          dispatch(failure(error.toString()));
        }
      );
  }
  function request(res) { return { type: onboardingConstants.GET_PROFILE_REQUEST, res } }
  function success(profileData) { return { type: onboardingConstants.GET_PROFILE_SUCCESS, profileData }; }
  function failure(error) { return { type: onboardingConstants.GET_PROFILE_FAILURE, error }; }
}
