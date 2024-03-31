import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
  const userId = auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
};
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("Upload Image complete");
    }),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("Upload Attachement complete");
    }),
  courseAudio: f({ audio: { maxFileCount: 1, maxFileSize: "32MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("Upload Audio complete");
    }),
  chatperVideo: f({ video: { maxFileCount: 1, maxFileSize: "128MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {
      console.log("Upload Video complete");
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;