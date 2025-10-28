import { wait } from "./test-utils";

import { testIntake } from "./intake.test";
import { testEpics } from "./epic.test";
import { testPage } from "./page.test";
import { testProjects } from "./project.test";
import { testLabels } from "./label.test";
import { testStates } from "./state.test";

import { testWorkItemTypes } from "./work-item-types/types.test";
import { testWorkItemTypesPropertiesAndOptions } from "./work-item-types/properties-options.test";
import { testWorkItemPropertiesValues } from "./work-item-types/properties-values.test";

import { testWorkItems } from "./work-items/work-items.test";
import { testWorkLogs } from "./work-items/work-logs.test";
import { testRelations } from "./work-items/relations.test";

import { testModules } from "./module.test";
import { testCycles } from "./cycle.test";

import { testCustomersWorkItems } from "./customers/work-items.test";
import { testCustomersPropertiesOptionsAndValues } from "./customers/properties-options.test";
import { testCustomers } from "./customers/customers.test";
import { testCustomersRequests } from "./customers/requests.test";

import { testOAuth } from "./oauth.test";
import { testComments } from "./work-items/comments.test";
import { testLinks } from "./work-items/links.test";
import { testActivities } from "./work-items/activities.test";

async function runAllTests() {
  await testIntake();
  await testEpics();
  await testPage();

  await wait(60);
  await testProjects();
  await testLabels();
  await testStates();
  await wait(60);

  await testWorkItemTypes();
  await testWorkItemTypesPropertiesAndOptions();
  await testWorkItemPropertiesValues();
  await wait(60);
  await testWorkItems();
  await testRelations();
  await testWorkLogs();

  await testModules();
  await testCycles();

  await wait(60);
  await testCustomers();
  await testCustomersWorkItems();
  await testCustomersPropertiesOptionsAndValues();
  await testCustomersRequests();

  await wait(60);
  await testComments();
  await testLinks();
  await testActivities();

  await wait(60);
  await testOAuth();
}

if (require.main === module) {
  runAllTests().catch(console.error);
}
