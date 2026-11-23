// CI/CD pipeline for nodejs-demo.
//
// Stages: install -> lint -> test -> build docker image -> (optional) push.
// Push and deploy stages are gated behind branch checks and expect
// DOCKER_REGISTRY_CREDENTIALS to be configured in Jenkins credentials if
// image push is enabled. No deploy stage is included here — deployment
// design/scripts live in the ai-engineering-team org repo
// (07-Projects/nodejs-demo/DEVOPS/).

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    IMAGE_NAME = 'nodejs-demo'
    IMAGE_TAG  = "${env.GIT_COMMIT ? env.GIT_COMMIT.take(12) : env.BUILD_NUMBER}"
  }

  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build Docker image') {
      steps {
        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest ."
      }
    }

    stage('Push Docker image') {
      when {
        anyOf { branch 'main'; branch 'dev' }
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'DOCKER_REGISTRY_CREDENTIALS',
          usernameVariable: 'REGISTRY_USER',
          passwordVariable: 'REGISTRY_PASS'
        )]) {
          sh '''
            echo "$REGISTRY_PASS" | docker login -u "$REGISTRY_USER" --password-stdin
            docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG}
            docker push ${REGISTRY_USER}/${IMAGE_NAME}:${IMAGE_TAG}
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f --filter "label=stage=build" || true'
    }
    success {
      echo "Build ${IMAGE_TAG} succeeded."
    }
    failure {
      echo "Build ${IMAGE_TAG} failed — see stage logs above."
    }
  }
}
