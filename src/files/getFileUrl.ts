import { ConfigService } from '@nestjs/config';

const useUrl = (params: { Key: string }, configService: ConfigService) => {
  const { Key } = params;
  const url = `https://${configService.get(
    'AWS_PUBLIC_BUCKET_NAME',
  )}.s3.${configService.get('AWS_REGION')}.amazonaws.com/${Key}`;

  return {
    url,
  };
};

export default useUrl;
