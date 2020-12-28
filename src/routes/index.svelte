<script context="module">
  export const preload: Preload = async function preload(_page, session) {
    if (
      session.user &&
      session.user.role &&
      session.user.role === ClientRole.ADMIN
    ) {
      return this.redirect(302, "/admin");
    }

    const client = clientWithSession(session);

    return {
      cache: await client.query<TakeSurveyQuery, TakeSurveyQueryVariables>({
        query: TakeSurveyDoc,
        fetchPolicy: "network-only",
      }),
    };
  };
</script>

<script>
  import type { Preload } from "@svazzle/common";
  import { goto } from "@svazzle/app";
  import { restore } from "svelte-apollo";
  import client, { clientWithSession } from "../apolloClient";
  import Accordion from "../components/ui/Accordion/Accordion.svelte";
  import AccordionSection from "../components/ui/Accordion/AccordionSection.svelte";
  import {
    HasCompletedSurveyDoc,
    SelectChoice,
    TakeSurvey,
    TakeSurveyDoc,
  } from "../generated/graphql";
  import type {
    HasCompletedSurveyQuery,
    HasCompletedSurveyQueryVariables,
    TakeSurveyQuery,
    TakeSurveyQueryVariables,
  } from "../generated/graphql";
  import { ClientRole } from "../types";
  import type { ApolloQueryResult } from "@apollo/client";
  import Button from "../components/ui/Button.svelte";
  import { tick } from "svelte";

  export let cache: ApolloQueryResult<any>;
  restore(TakeSurveyDoc, cache);
  const survey = TakeSurvey({});
  let selectedAccordion = $survey?.data?.takeSurvey?.categories[0]?.id || null;

  const selectChoice = SelectChoice();

  async function sendSelectedChoice(
    categoryId: string,
    questionId: string,
    choiceId: string
  ) {
    const surveyId = $survey.data!.takeSurvey!.id;
    await selectChoice({
      variables: { categoryId, surveyId, choiceId, questionId },
    });
  }

  async function onSubmit() {
    const completed = await client.query<
      HasCompletedSurveyQuery,
      HasCompletedSurveyQueryVariables
    >({ query: HasCompletedSurveyDoc, variables: {} });
    const isComplete = completed.data.hasCompletedSurvey;
    if (!isComplete) {
      return;
    }
    goto("/ergebnis");
  }
</script>

<div class="min-h-screen bg-gray-100">
  <main class="py-4">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="relative pt-6 pb-8 lg:pt-8 lg:pb-12">
        <div class="absolute inset-0">
          <div class="h-1/3 sm:h-2/3" />
        </div>
        <div class="relative max-w-7xl mx-auto">
          <div>
            <h2
              class="text-2xl sm:text-3xl tracking-tight font-extrabold text-gray-900 md:text-4xl">
              {$survey.data?.takeSurvey?.name}
            </h2>
            <p
              class="mt-3 max-w-2xl sm:text-lg md:text-xl text-gray-500 sm:mt-4">
              {$survey.data?.takeSurvey?.description}
            </p>
          </div>
          <form on:submit|preventDefault={onSubmit} class="mt-12">
            <Accordion
              on:change={(e) => {
                selectedAccordion = e.detail;
              }}
              bind:value={selectedAccordion}>
              {#each $survey?.data?.takeSurvey?.categories || [] as category, catIndex}
                <AccordionSection key={category.id} let:open>
                  <div class="flex items-center justify-between" slot="header">
                    <div class="flex items-center space-x-3">
                      <div
                        class="rounded-full {!open ? 'border border-gray-200' : 'bg-gray-100'} overflow-hidden w-10 h-10 inline-flex justify-start items-center p-1">
                        <img
                          class="w-full h-full object-cover rounded-full"
                          src={category.image || 'https://matchdigital.de/img/survey/cards/geschaeftsmodell.svg'}
                          alt={category.name} />
                      </div>
                      <h4 class="font-bold">{category.name}</h4>
                    </div>
                  </div>
                  {#each category.questions as question, questionIndex}
                    <div
                      id="question-container-{question.id}"
                      class="bg-indigo-50 w-full rounded-lg px-6 py-8 mt-3">
                      <h4 class="text-gray-900 font-semibold text-lg mb-6">
                        {questionIndex + 1}.
                        {question.question}
                      </h4>
                      <div
                        class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start">
                        {#each question.choices as choice}
                          <div class="flex items-center mb-4 sm:mr-10">
                            <input
                              id="question-{question.id}-answer-{choice.id}"
                              name="question-{question.id}"
                              value={choice.id}
                              checked={choice.selected}
                              on:change={async () => {
                                sendSelectedChoice(category.id, question.id, choice.id);
                                if (questionIndex + 1 < category.questions.length) {
                                  const questionRef = document.querySelector('#question-container-' + category.questions[questionIndex + 1].id);
                                  if (questionRef) {
                                    questionRef.scrollIntoView({
                                      behavior: 'smooth',
                                      block: 'center',
                                    });
                                  }
                                }
                                if (questionIndex === category.questions.length - 1) {
                                  const cat = $survey?.data?.takeSurvey?.categories || [];
                                  if (catIndex + 1 > cat.length - 1) {
                                    onSubmit();
                                    return;
                                  }
                                  selectedAccordion = cat[catIndex + 1].id;
                                  await tick();
                                  const ref = document.querySelector('.accordion-' + category.id);
                                  if (ref && ref.getBoundingClientRect().top < 0) {
                                    ref.scrollIntoView({
                                      behavior: 'smooth',
                                      block: 'start',
                                    });
                                  }
                                }
                              }}
                              type="radio"
                              class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                            <label
                              for="question-{question.id}-answer-{choice.id}"
                              class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                              <span
                                class="block font-medium text-gray-700">{choice.choice}</span>
                            </label>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/each}
                </AccordionSection>
              {/each}
            </Accordion>
            <Button type="submit" variant="primary">Ergebnis</Button>
          </form>
        </div>
      </div>
    </div>
  </main>
</div>
