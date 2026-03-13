import { UserStory } from "../entities/UserStory";

export interface IEstimationStrategy {
  calculate(story: UserStory): number | null;
}

export class FibonacciEstimationStrategy implements IEstimationStrategy {
  private readonly heavyKeywords = [
    'lambda','eventbridge','sqs','sns','cognito','migración','migrar',
    'integración','integrar','autenticación','oauth','jwt','cifrado',
    'encriptar','refactor','arquitectura','microservicio','websocket',
    'elasticsearch','kafka','redis','cache','pipeline','ci/cd','deploy',
    'kubernetes','docker','terraform','seguridad','permisos','roles','iam',
    'webhook','tercero','proveedor','pasarela','gateway','stripe','twilio',
    'firebase','notificación push','fcm','apns','machine learning','ia','ml'
  ];

  calculate(story: UserStory): number | null {
    const tasks = story.tasks.filter(t => t.text.trim());
    if (!tasks.length) return null;

    let score = tasks.length;
    
    tasks.forEach(t => {
      if (t.layer === 'integracion') score += 1.5;
      if (t.layer === 'infra') score += 1;
    });

    const allText = tasks.map(t => t.text).join(' ').toLowerCase();
    this.heavyKeywords.forEach(kw => { if (allText.includes(kw)) score += 1.5; });

    if (score <= 1) return 1;
    if (score <= 2) return 2;
    if (score <= 4) return 3;
    if (score <= 6) return 5;
    if (score <= 9) return 8;
    if (score <= 13) return 13;
    return 21;
  }
}
