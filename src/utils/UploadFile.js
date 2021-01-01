import  { storage } from "../firebase/firebase";

export default function UploadFile(currentUser, file, setProgress, dir, name) {
  return new Promise((resolve, reject) => {
    var uploadTask = storage.ref(dir).child(name).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      async () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          setProgress(null);
          resolve(downloadURL);
        });
      }
    );
  });
}
