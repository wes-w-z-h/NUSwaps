pipeline {
    agent any

    environment {
        MONGO_URI=credentials('MONGO_URI')
        PORT=3000
    }

    stages {
        stage('Start server') {
            steps {
                sh '''
                cd backend/
                echo "MONGO_URI=${MONGO_URI}" >> .env
                echo "PORT=${PORT}" >> .env
                docker compose up -d server
                '''
            }
        }
        stage('Test api') {
            steps {
                sh '''
                cd backend/
                docker compose up api-tester
                '''
            }
        }
        stage('Cleanup') {
            steps {
                sh '''
                echo "cleanup"
                rm -f .env
                '''
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
