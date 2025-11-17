import mysql from 'mysql2';

const testConnections = [
    { user: 'dbuser', password: 'c3409711!' },
    { user: 'dbuser', password: 'c3409711' },
    { user: 'root', password: '' },
];

for (const config of testConnections) {
    try {
        const connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: config.user,
            password: config.password,
        });
        
        connection.connect((err) => {
            if (err) {
                console.log(`❌ ${config.user} 접속 실패:`, err.message);
            } else {
                console.log(`✅ ${config.user} 접속 성공!`);
                connection.end();
            }
        });
    } catch (error) {
        console.log(`❌ ${config.user} 연결 시도 실패:`, error.message);
    }
}
