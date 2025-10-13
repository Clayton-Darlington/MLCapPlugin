export interface HelloWorldPlugin {
  /**
   * Shows a simple hello world message
   */
  echo(options: { value: string }): Promise<{ value: string }>;

  /**
   * Gets a greeting message
   */
  getGreeting(options: { name: string }): Promise<{ greeting: string }>;
}