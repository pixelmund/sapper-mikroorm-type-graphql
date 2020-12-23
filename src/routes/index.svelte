<script context="module">
  export const preload: Preload = async function preload(_page, session) {
    if (
      session.user &&
      session.user.role &&
      session.user.role === ClientRole.ADMIN
    ) {
      return this.redirect(302, "/admin");
    }
    return;
  };
</script>

<script>
  import type { Preload } from "@svazzle/common";
  import Accordion from "../components/ui/Accordion/Accordion.svelte";
  import AccordionSection from "../components/ui/Accordion/AccordionSection.svelte";
  import { ClientRole } from "../types";

  let selectedAccordion = 1;
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
              Der Digital Check
            </h2>
            <p class="mt-3 max-w-2xl sm:text-lg md:text-xl text-gray-500 sm:mt-4">
              Testen Sie sich in verschiedenen Kategorien und finden Sie Ihre
              Potenziale heraus.
            </p>
          </div>
          <div class="mt-12">
            <Accordion
              on:change={(e) => {
                selectedAccordion = e.detail;
              }}
              bind:value={selectedAccordion}>
              <AccordionSection key={1} let:open>
                <div class="flex items-center justify-between" slot="header">
                  <div class="flex items-center space-x-3">
                    <div
                      class="rounded-full {!open ? 'border border-gray-200' : 'bg-gray-100'} overflow-hidden w-10 h-10 inline-flex justify-start items-center p-1">
                      <img
                        class="w-full h-full object-cover rounded-full"
                        src="https://matchdigital.de/img/survey/cards/geschaeftsmodell.svg"
                        alt="Geschäftsmodell und Strategie" />
                    </div>
                    <h4 class="font-bold">Gechäftsmodell und Strategie</h4>
                  </div>
                </div>
                <div class="bg-indigo-50 w-full rounded-lg px-6 py-8 mt-3">
                  <h4 class="text-gray-900 font-semibold text-lg mb-6">
                    1. Setzen Sie Künstliche Intelligenz derzeit in Ihrem
                    Unternehmen ein?
                  </h4>
                  <div
                    class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start">
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-1-answer-1"
                        name="question-1"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-1-answer-1"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span class="block font-medium text-gray-700">Ja</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-1-answer-2"
                        name="question-1"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-1-answer-2"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Nein</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-1-answer-3"
                        name="question-1"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-1-answer-3"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Teilweise</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-1-answer-4"
                        name="question-1"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-1-answer-4"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Irrelevant</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="bg-indigo-50 w-full rounded-lg px-6 py-8 mt-3">
                  <h4 class="text-gray-900 font-semibold text-lg mb-6">
                    2. Haben Sie bisher Versuche unternommen, KI einzuführen?
                  </h4>
                  <div
                    class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start">
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-2-answer-1"
                        name="question-2"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-2-answer-1"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span class="block font-medium text-gray-700">Ja</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-2-answer-2"
                        name="question-2"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-2-answer-2"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Nein</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-2-answer-3"
                        name="question-2"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-2-answer-3"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Teilweise</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-2-answer-4"
                        name="question-2"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-2-answer-4"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Irrelevant</span>
                      </label>
                    </div>
                  </div>
                </div>
              </AccordionSection>
              <AccordionSection key={2} let:open>
                <div class="flex items-center justify-between" slot="header">
                  <div class="flex items-center space-x-3">
                    <div
                      class="rounded-full {!open ? 'border border-gray-200' : 'bg-gray-100'} overflow-hidden w-10 h-10 inline-flex justify-start items-center p-1">
                      <img
                        class="w-full h-full object-cover rounded-full"
                        src="https://matchdigital.de/img/survey/cards/organisation.svg"
                        alt="Organisation" />
                    </div>
                    <h4 class="font-bold">Organisation</h4>
                  </div>
                </div>
                <div class="bg-indigo-50 w-full rounded-lg px-6 py-8 mt-3">
                  <h4 class="text-gray-900 font-semibold text-lg mb-6">
                    1. Setzen Sie Künstliche Intelligenz derzeit in Ihrem
                    Unternehmen ein?
                  </h4>
                  <div
                    class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start">
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-1-answer-1"
                        name="question-1"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-1-answer-1"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span class="block font-medium text-gray-700">Ja</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-1-answer-2"
                        name="question-1"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-1-answer-2"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Nein</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-1-answer-3"
                        name="question-1"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-1-answer-3"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Teilweise</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-1-answer-4"
                        name="question-1"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-1-answer-4"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Irrelevant</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="bg-indigo-50 w-full rounded-lg px-6 py-8 mt-3">
                  <h4 class="text-gray-900 font-semibold text-lg mb-6">
                    2. Haben Sie bisher Versuche unternommen, KI einzuführen?
                  </h4>
                  <div
                    class="flex flex-col sm:flex-row sm:flex-wrap sm:justify-start">
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-2-answer-1"
                        name="question-2"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-2-answer-1"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span class="block font-medium text-gray-700">Ja</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-2-answer-2"
                        name="question-2"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-2-answer-2"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Nein</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-2-answer-3"
                        name="question-2"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-2-answer-3"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Teilweise</span>
                      </label>
                    </div>
                    <div class="flex items-center mb-4 sm:mr-10">
                      <input
                        id="question-2-answer-4"
                        name="question-2"
                        type="radio"
                        class="focus:ring-indigo-500 h-6 w-6 text-indigo-600 border-gray-300 cursor-pointer" />
                      <label
                        for="question-2-answer-4"
                        class="cursor-pointer ml-3 px-3 block w-full py-1.5 rounded-md bg-gray-50 sm:w-auto sm:px-8">
                        <span
                          class="block font-medium text-gray-700">Irrelevant</span>
                      </label>
                    </div>
                  </div>
                </div>
              </AccordionSection>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
