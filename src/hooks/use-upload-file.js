import {
  getWorkItemAttachmentS3SignedURL,
  uploadFilesToS3Bucket,
} from "../services/workitems";

export const useUploadFile = () => {
  const uploadFile = async ({ wid, file }) => {
    const { name, type } = file;
    const s3SignedURL = await getWorkItemAttachmentS3SignedURL(wid, {
      name,
      type,
    });
    if (s3SignedURL.url) {
      const options = {
        headers: {
          "Content-Type": type,
        },
      };
      const response = await uploadFilesToS3Bucket(
        s3SignedURL.url,
        file,
        options
      );
      if (response.status === 200) {
        const rawUrl = response.config.url;

        const cutIndex = rawUrl.indexOf("?AWSAccessKeyId");
        if (cutIndex) {
          return rawUrl.substr(0, cutIndex);
        }
        return rawUrl;
      }
      return;
    }
    return;
  };
  return { uploadFile };
};
