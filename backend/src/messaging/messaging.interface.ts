export interface MessagingProvider {
  sendMessage(
    companyId: string,
    number: string,
    message: string,
  ): Promise<void>;
}
