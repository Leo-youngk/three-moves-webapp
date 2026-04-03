declare module "web-push" {
  const webpush: {
    setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
    sendNotification(
      subscription: {
        endpoint: string;
        keys: {
          p256dh: string;
          auth: string;
        };
        expirationTime?: number | null;
      },
      payload: string,
    ): Promise<void>;
  };

  export default webpush;
}
