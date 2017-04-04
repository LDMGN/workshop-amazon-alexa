'use strict';

// --------------- Functions that control the skill's behavior -------------------
// --------------- Write your own here -------------------------------------------



// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

// --------------- Events -----------------------


/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session) {
}

function callGetCookie(intentRequest, callback) {
    const sessionAttributes = {};
    const cardTitle = 'welcome';
    const messages = [
        "If you refuse to accept anything but the best, you very often get it.",
        "Hard work pays off in the future, laziness pays off now.",
        "A good way to keep healthy is to eat more Chinese food.",
        "You learn from your mistakes... You will learn a lot today.",
        "You cannot love life until you live the life you love.",
        "Never give up. You're not a failure if you don't give up.",
        "You must try, or hate yourself for not trying.",
        "The greatest risk is not taking one.",
        "I think, you ate your fortune while you were eating your cookie",
        "I have a dream....Time to go to bed.",
        "The fortune you seek, is in another cookie",
        "If you eat a box of fortune cookies, anything is possible.",
        "The early bird gets the worm, but the second mouse gets the cheese",
        "Use the force",
        "Your life will be joyful, except the end, when you'll pee yourself"
        ];
    const speechOutput = messages[Math.floor(Math.random() * messages.length)];
    const repromptText = "Do you want a cookie?";
    const shouldEndSession = true;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    const intentName = intentRequest.intent.name;
    if (intentName === 'GetCookie') {
        callGetCookie(intentRequest, callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
}

// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.


exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request, event.session);
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        response: speechletResponse,
        sessionAttributes,
    };
}
