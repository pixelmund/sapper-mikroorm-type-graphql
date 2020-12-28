import type { EntityManager } from "@mikro-orm/core";
import {
  Action,
  ActionTypes,
  Category,
  Choice,
  Question,
  Survey,
} from "../entities/Survey";

export default async function seedSurvey(oldEm: EntityManager) {
  console.log('running');
  
  const em = oldEm.fork();

  const surveyRepo = em.getRepository<Survey>("Survey");
  const categoryRepo = em.getRepository<Category>("Category");

  const findSurvey = await surveyRepo.find({});

  if(findSurvey && findSurvey.length > 0){
    return;
  }

  const survey = surveyRepo.create({
    name: "Digital Check",
    description:
      "Testen Sie sich in verschiedenen Kategorien und finden Sie Ihre Potenziale heraus.",
  });
  em.persist(survey);
  const categoryOne = categoryRepo.create({
    name: "Geschäftsmodell und Strategie",
    published: true,
    image: "https://matchdigital.de/img/survey/cards/geschaeftsmodell.svg",
    survey,
  });
  const categoryTwo = categoryRepo.create({
    name: "Organisation",
    published: true,
    image: "https://matchdigital.de/img/survey/cards/organisation.svg",
    survey,
  });
  em.persist([categoryOne, categoryTwo]);
  createQuestion(
    "Wir haben im Unternehmen eine klar definierte Digitalisierungsstrategie.",
    { em, category: categoryOne, survey }
  );
  createQuestion(
    "In Fragen der Digitalisierung haben wir klar definierte Ansprechpartner und Verantwortliche.",
    { em, category: categoryOne, survey }
  );
  createQuestion(
    "Unsere IT wird in die Produktentwicklung miteinbezogen.",
    { em, category: categoryOne, survey }
  );
  createQuestion(
    "Themen der Digitalisierung werden im Unternehmen von den MitarbeiterInnen umgesetzt.",
    { em, category: categoryOne, survey }
  );
  createQuestion(
    "Wir transformieren unsere bestehenden Geschäftsmodelle digital und / oder entwickeln neue digitale Geschäftsmodelle.",
    { em, category: categoryOne, survey }
  );
  createQuestion(
    "Wir erschließen mit unseren Produkten und Dienstleistungen neue Wertschöpfungspotenziale, Kundensegmente und Märkte.",
    { em, category: categoryOne, survey }
  );
  createQuestion(
    "In unserem Unternehmen werden organisationale Silos (stark voneinander abgegrenzte Unternehmensbereiche mit starren Strukturen) zunehmend aufgelöst.",
    { em, category: categoryTwo, survey }
  );
  createQuestion(
    "Wir bieten MitarbeiterInnen Möglichkeiten, um die digitale Transformation aktiv mitzugestalten und sich einzubringen.",
    { em, category: categoryTwo, survey }
  );
  createQuestion(
    "Unsere MitarbeiterInnen können interne Prozesse wie Urlaubsanträge, Krankmeldungen, ihre geleisteten Arbeitsstunden etc. elektronisch abgeben und einsehen.",
    { em, category: categoryTwo, survey }
  );
  createQuestion(
    "In unserem Unternehmen werden organisationale Silos (stark voneinander abgegrenzte Unternehmensbereiche mit starren Strukturen) zunehmend aufgelöst.",
    { em, category: categoryTwo, survey }
  );
  createQuestion(
    "Die Arbeitsbedingungen in unserem Unternehmen schaffen Raum für Kreativität und Innovation.",
    { em, category: categoryTwo, survey }
  );
  createQuestion(
    "Der Austausch und die Zusammenarbeit zwischen unseren Unternehmensabteilungen wird durch die Nutzung von digitalen Technologien wesentlich gefördert.",
    { em, category: categoryTwo, survey }
  );
  await em.flush();
}

function createQuestion(
  q: string,
  {
    survey,
    category,
    em,
  }: { survey: Survey; category: Category; em: EntityManager }
) {
  const questionRepo = em.getRepository<Question>("Question");
  const choiceRepo = em.getRepository<Choice>("Choice");
  const actionRepo = em.getRepository<Action>("Action");
  const question = questionRepo.create({
    category,
    survey,
    description: "Lorem ipsum dolor sit amet",
    question: q,
  })
  const choices = [
    choiceRepo.create({
      choice: "Ja",
      question,
      actions: [
        actionRepo.create({
          question,
          type: ActionTypes.ADD,
          value: Math.round(100 / 4),
        }),
      ],
    }),
    choiceRepo.create({
      choice: "Nein",
      question,
      actions: [
        actionRepo.create({
          question,
          type: ActionTypes.REDUCE,
          value: Math.round(10 / 4),
        }),
      ],
    }),
    choiceRepo.create({
      choice: "Teilweise",
      question,
      actions: [
        actionRepo.create({
          question,
          type: ActionTypes.ADD,
          value: Math.round(50 / 4),
        }),
      ],
    }),
    choiceRepo.create({
      question,
      choice: "Irrelevant",
    }),
  ]
  em.persist(question);
  em.persist(choices);
}
