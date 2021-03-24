# CDK Secrets

Using static secrets in CDK

## Deploying the app

When deploying, pass `MySecretParam` as a parameters argument:

```bash
yarn cdk deploy --parameters MySecretParam=MYPASSWORDHERE
```

## Useful commands

- `yarn build` compile typescript to js
- `yarn watch` watch for changes and compile
- `yarn test` perform the jest unit tests
- `yarn cdk deploy` deploy this stack to your default AWS account/region
- `yarn cdk diff` compare deployed stack with current state
- `yarn cdk synth` emits the synthesized CloudFormation template
