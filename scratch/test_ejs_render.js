const ejs = require('ejs');
const fs = require('fs');

const tpl = fs.readFileSync('views/teacher_dashboard.ejs', 'utf8');
const html = ejs.render(tpl, {
  teacher: { id: 1, name: 'Fabio Marques', email: 'fabio@test.com', level: { title: 'Mestre', color: '#2563eb' } },
  classes: [{ id: 1, class_name: '3º Ano A', school_name: 'E. M. Teste', student_count: 0, access_code: 'LKTEST', active_simulados: [] }],
  teacherSchools: ['E. M. Teste'],
  collections: [],
  exams: [],
  examSubmissions: [],
  planning: [],
  activities: [],
  topActivities: [],
  studentsActivity: [],
  simuladoSubmissions: [],
  favorites: [],
  globalExams: [],
  query: {}
});

const scriptMatches = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
console.log('Script count:', scriptMatches.length);
fs.writeFileSync('scratch/dashboard_script.js', scriptMatches[2][1]);
console.log('Saved scratch/dashboard_script.js! Size of rendered html:', html.length);
