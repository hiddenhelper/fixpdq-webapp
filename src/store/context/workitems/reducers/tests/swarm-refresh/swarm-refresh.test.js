import { swarmRefreshReducerPureFunction } from "../../swarm-refresh";
import { payload as p1, state as s1 } from "./test-case-1";
import { payload as p2, state as s2 } from "./test-case-2";

test("1.1 swarm-refresh. user pressed tab", () => {
  // Q
  // - W
  // - E
  // R
  // -> T (press tab on T)

  const refreshedWorkitems = swarmRefreshReducerPureFunction(s1, {
    payload: p1,
  });
  expect(refreshedWorkitems.length).toEqual(5);
  // Get T
  const indexOfT = refreshedWorkitems.findIndex(
    (i) => (i.workitemid = "4334f656-cca6-40b8-99d0-c7ab0390e9f5")
  );
  const itemT = refreshedWorkitems[indexOfT];
  // check that R is a parent
  expect(itemT.parentid).toEqual("a5da2fdc-4c50-489d-ae61-4f7378de21a7");
  // expect(itemT.sort).toEqual(undefined);
  // console.log(itemT.sort);
});

test("1.2 swarm-refresh. user pressed backspace", () => {
  // Q
  // - W
  // - - E
  // - - R - remove R
  // - - T
  // - - U

  const refreshedWorkitems = swarmRefreshReducerPureFunction(s2, {
    payload: p2,
  });
  expect(refreshedWorkitems.length).toEqual(6);
  // Get R
  const itemR = refreshedWorkitems.find(
    (item) => item.workitemid === "5073abac-26d9-4985-a5da-d72c07199397"
  );
  const itemE = refreshedWorkitems.find(
    (item) => item.workitemid === "ff39407f-e0bb-4b35-9d7c-7a815b4a2589"
  );
  const itemT = refreshedWorkitems.find(
    (item) => item.workitemid === "cd458cd0-6cf2-4623-9207-85b8b4e48fdd"
  );
  // // check that R is a parent
  expect(itemR.status).toEqual("DELETED");
  expect(itemE.next).toEqual(itemT.workitemid);
  // console.log(itemT.sort);
});
