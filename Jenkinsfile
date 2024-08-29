pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/CUraweda/Ischool-modul-guru.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                sshPublisher(publishers: [sshPublisherDesc(
                    configName: 'cPanel',
                    transfers: [sshTransfer(
                        sourceFiles: 'dist/**',
                        remoteDirectory: '/',
                        removePrefix: 'dist'
                    )],
                    usePromotionTimestamp: false,
                    useWorkspaceInPromotion: false,
                    verbose: true
                )])
            }
        }
    }
}
