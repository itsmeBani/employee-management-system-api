
import admin from "firebase-admin";
import type  {Document} from "../../model.ts";
export const getAllDocuments = async (collectionName: Document) => {
    const collectionRef = admin.firestore().collection(collectionName);
    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
        return null;
    }
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
};
