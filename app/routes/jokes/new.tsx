import type { ActionFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { db } from '~/utils/db.server';

function validateJokeContent(content: string) {
  if (content.length < 10) {
    return `That joke is too short`;
  }
}

function validateJokeName(name: string) {
  if (name.length < 3) {
    return `That joke's name is too short`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
    content: string | undefined;
  };
  fields?: {
    name: string;
    content: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const name = form.get('name');
  const content = form.get('content');
  if (typeof name !== 'string' || typeof content !== 'string') {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content),
  };
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const joke = await db.joke.create({ data: fields });
  return redirect(`/jokes/${joke.id}`);
};

export default function NewJokeRoute() {
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method='post'>
        <div>
          <label>
            Name:{' '}
            <input
              type='text'
              defaultValue={actionData?.fields?.name}
              name='name'
              aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
              aria-errormessage={
                actionData?.fieldErrors?.name ? 'name-error' : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p className='form-validation-error' role='alert' id='name-error'>
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{' '}
            <textarea
              defaultValue={actionData?.fields?.content}
              name='content'
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content ? 'content-error' : undefined
              }
              onChange={(e) => console.log(e)}
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className='form-validation-error'
              role='alert'
              id='content-error'
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p className='form-validation-error' role='alert'>
              {actionData.formError}
            </p>
          ) : null}
          <button type='submit' className='button'>
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

// RickRieger — 08/01/2022
// Hello, I'm trying to learn Remix and I'm feeling quite confused about capturing user input in a text field with the onChange event.  Does anyone care to help me out?  (yea, I'm green)

// remy
// BOT
//  — 08/01/2022
// Hi @RickRieger
// Let's discuss this further here. Feel free to change the thread title to something more descriptive if you like.

// Kent C. Dodds — 08/01/2022
// Could you elaborate on why you're trying to capture the user input with onChange?

// RickRieger — 08/01/2022
// To get rid of error messages during validation
// [10:36 PM]
// The man!    I've been diving into the jokes app.  Great Content

// 1

// Kent C. Dodds — 08/01/2022
// We're gonna need to see some code I think. Can you share some of what you have so far and what you've already tried?

// RickRieger — 08/01/2022
// It's right off the tutorial
// [10:38 PM]
// guess a screen shot?

// Kent C. Dodds — 08/01/2022
// Which part are you at?

// RickRieger — 08/01/2022
// Sorry man...New to Discord didnt want to just copy paste
// [10:42 PM]
// the mutations
// [10:43 PM]
// after that, content too long, name too long server side validations
// [10:44 PM]
// errors shown on client side, then I paused to try and figure out for myself how to get rid of error messages as user types
// [10:45 PM]
// I threw an onChange in the input field with a console.log

// Kent C. Dodds — 08/01/2022
// Ah, gotcha.
// [10:48 PM]
// Yeah, so what you'll need to do for this is store a copy of the error state in a useState variable. When the actionData updates, you'll have a useEffect that runs and calls the state updater (like setNameError) to set the error state. Then your onChange handler can set it to null or whatever else you'd like when the user types. (edited)

// RickRieger — 08/01/2022
// Thanks man, I need to chew on this as I'm still pretty new to it all.  Remix is kinda blowin my mind a bit after I went to a coding school for a year learning React.  Good Job and I'm honored you took the time to respond.
