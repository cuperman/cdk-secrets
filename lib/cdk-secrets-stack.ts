import * as cdk from '@aws-cdk/core';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';

export class CdkSecretsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create a parameter to pass in the secret at deploy time
    const mySecretParam = new cdk.CfnParameter(this, 'MySecretParam', {
      type: 'String',
      noEcho: true
    });

    // you can store the secret in secrets manager for other services to access at runtime
    const mySecret = new secretsmanager.CfnSecret(this, 'MySecret', {
      name: 'my/secret',
      secretString: mySecretParam.valueAsString
    });

    const mySecretArn = cdk.Fn.ref(mySecret.node.id);

    // some services, like CodeBuild support secrets manager integration in the environment variable interface
    const myProject = new codebuild.Project(this, 'MyProject', {
      environmentVariables: {
        SECRET: {
          type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
          value: mySecretArn
        }
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: ['echo Hello, World! $SECRET']
          }
        }
      })
    });

    myProject.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: [mySecretArn]
      })
    );

    // Lambda functions don't support secrets manager integration like CodeBuild, but it does support environment variable encryption
    // FIXME: Encrypted environment variables aren't supported in CDK or CloudFormation :(
    const myLambda = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromInline(`
        exports.handler = async () => {
          const secret = process.env.SECRET;
          return 'Hello, World! ' + secret;
        };
      `),
      handler: 'index.handler',
      environment: {
        SECRET: mySecretParam.valueAsString
      }
    });
  }
}
