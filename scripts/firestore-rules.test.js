
 // @vitest-environment node

import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const PROJECT_ID = "demo-unihub";

let testEnv;

// Test users
const validStudent = {
  uid: "student-1",
  email: "student@mitsgwl.ac.in",
  email_verified: true,
};

const anotherStudent = {
  uid: "student-2",
  email: "another@mitsgwl.ac.in",
  email_verified: true,
};

const unverifiedStudent = {
  uid: "student-3",
  email: "unverified@mitsgwl.ac.in",
  email_verified: false,
};

const outsider = {
  uid: "outsider-1",
  email: "outsider@gmail.com",
  email_verified: true,
};

// Create an authenticated Firestore instance
function authenticatedDb(user) {
  const { uid, ...claims } = user;

  return testEnv
    .authenticatedContext(uid, claims)
    .firestore();
}

// Valid Lost & Found report
const validReport = (uid) => ({
  status: "lost",
  title: "Lost calculator",
  description: "Black scientific calculator",
  location: "College library",
  ownerId: uid,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});

// Emulator setup
beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

// Security tests
describe("UniHub Firestore Security Rules", () => {
  it("allows public Marketplace reads", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "marketplace/item-1"), {
        ownerId: "student-1",
        title: "Book",
      });
    });

    const db = testEnv.unauthenticatedContext().firestore();

    await assertSucceeds(
      getDoc(doc(db, "marketplace/item-1"))
    );
  });

  it("allows verified MITS students to create their own Marketplace listings", async () => {
    const db = authenticatedDb(validStudent);

    await assertSucceeds(
      setDoc(doc(db, "marketplace/item-2"), {
        ownerId: validStudent.uid,
        title: "Engineering book",
      })
    );
  });

  it("rejects users creating listings for another owner", async () => {
    const db = authenticatedDb(validStudent);

    await assertFails(
      setDoc(doc(db, "marketplace/item-3"), {
        ownerId: anotherStudent.uid,
        title: "Book",
      })
    );
  });

  it("rejects unverified students from creating listings", async () => {
    const db = authenticatedDb(unverifiedStudent);

    await assertFails(
      setDoc(doc(db, "marketplace/item-4"), {
        ownerId: unverifiedStudent.uid,
        title: "Book",
      })
    );
  });

  it("rejects users outside the MITS email domain", async () => {
    const db = authenticatedDb(outsider);

    await assertFails(
      setDoc(doc(db, "marketplace/item-5"), {
        ownerId: outsider.uid,
        title: "Book",
      })
    );
  });

  it("prevents students from modifying another user's listing", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "marketplace/item-6"), {
        ownerId: anotherStudent.uid,
        title: "Original book",
      });
    });

    const db = authenticatedDb(validStudent);

    await assertFails(
      updateDoc(doc(db, "marketplace/item-6"), {
        title: "Changed book",
      })
    );
  });

  it("allows a verified student to access their own profile", async () => {
    const db = authenticatedDb(validStudent);

    await assertSucceeds(
      setDoc(doc(db, "users/student-1"), {
        name: "Student One",
      })
    );
  });

  it("allows verified students to read another student's profile", async () => {
    const db = authenticatedDb(validStudent);

    await assertSucceeds(
      getDoc(doc(db, "users/student-2"))
    );
  });

  it("allows a verified student to read Lost & Found reports", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "lostFoundReports/report-1"), {
        status: "lost",
        title: "Calculator",
        description: "Black calculator",
        location: "Library",
        ownerId: anotherStudent.uid,
      });
    });

    const db = authenticatedDb(validStudent);

    await assertSucceeds(
      getDoc(doc(db, "lostFoundReports/report-1"))
    );
  });

  it("rejects outsiders from reading Lost & Found reports", async () => {
    const db = authenticatedDb(outsider);

    await assertFails(
      getDocs(collection(db, "lostFoundReports"))
    );
  });

  it("rejects Lost & Found reports with invalid coordinates", async () => {
    const db = authenticatedDb(validStudent);

    await assertFails(
      setDoc(doc(db, "lostFoundReports/report-2"), {
        ...validReport(validStudent.uid),
        latitude: 120,
        longitude: 77,
      })
    );
  });

  it("rejects Lost & Found reports created for another owner", async () => {
    const db = authenticatedDb(validStudent);

    await assertFails(
      setDoc(doc(db, "lostFoundReports/report-3"), {
        ...validReport(anotherStudent.uid),
      })
    );
  });
});
