<template>
  <v-container>
    <v-sheet style="width: calc(90vh * 8.5 / 11);
          margin: 0 auto; 
          position: relative;">

      <div class="resume" >
      <header>
        <h1>{{ name }}</h1>
        <p>{{ location }} | {{ phone }} | <a :href="'mailto:' + email">{{ email }}</a> | <a :href="linkedin">{{ linkedin }}</a></p>
      </header>
  
      <section >
        <p >{{ about }}</p>
      </section>
  
      <section>
        <h2><strong>EDUCATION</strong></h2>
        <div>
        <div class="dated-row">
            <div>
            <p><strong>{{ education.institution }}</strong>, {{ education.location }} </p>
          </div>
          <div>
            <p> Projected {{ education.graduation }} </p>
          </div>
        </div>
        <div class="dated-row">
          <div>
          <p> Bachelor of Science in {{ education.degree }}</p> 
          </div>
          <div>
          <p> GPA: {{ education.gpa }} </p>
          </div>
        </div>
      </div>
      </section>
  
      <section>
        <h2><strong>EXPERIENCE</strong></h2>
        <div v-for="job in experience" :key="job.id">
          <div class="dated-row">
            <div>
              <p><strong>{{ job.company }}</strong>, {{ job.location }} </p>
          </div>
          <div>
            <p> {{ job.period }}</p>
          </div>
          </div>

          <p>{{ job.title }}</p>
          <ul>
            <li v-for="task in job.tasks" :key="task">{{ task }}</li>
          </ul>
        </div>
      </section>
  
      <section>
        <h2><strong>PROJECTS</strong></h2>
        <div v-for="project in projects" :key="project.id">
          <div class="dated-row">
            <div>
            <p><strong>{{ project.institution }}</strong>, {{ project.location }} </p>
          </div>
          <div>
            
            <p>{{ project.period }}</p>
          </div>
          </div>

          <p>{{ project.title }}</p>
          <ul>
            <li v-for="task in project.tasks" :key="task">{{ task }}</li>
          </ul>
        </div>
      </section>
  
      <section>
        <h2><strong>SKILLS</strong></h2>
        <p>{{ skills.join(' | ') }}</p>
      </section>
    </div>
    </v-sheet>
  </v-container>

  </template>
  
  <script>
  export default {
    data() {
      return {
        name: "Ike T. Eagle",
        location: "Edmond, OK",
        phone: "405.453.3245",
        email: "ike.eagle@eagles.oc.edu",
        linkedin: "Linkedin Url / Website Url (optional)",
        about: "Analytic-focused data professional with 2+ years’ experience developing computational models and executing statistical projects to drive insights. Demonstrated ability to translate complex datasets into actionable information and support overarching research initiatives.",
        education: {
          institution: "Oklahoma Christian University",
          location: "Edmond, OK",
          graduation: "May, 20xx",
          degree: "Computer Engineering",
          gpa: "3.xx/4.x"
        },
        experience: [
          {
            id: 1,
            company: "Oklahoma Christian University",
            location: "Edmond, OK",
            period: "August, 20xx – Present",
            title: "Job Title",
            tasks: [
              "Collaborated with cross-functional team of computer, electrical, and mechanical engineers to define and prioritize data science projects, driving $1.5M NIST-funded research in multimedia storage systems",
              "Conducted exploratory data analysis (EDA) on large datasets using Python and SQL, identifying key trends and patterns to inform research focused on multimedia bit rate conversion",
              "Conducted statistical analysis of experimental results to evaluate the effectiveness of algorithms and models",
              "Developed software tools and libraries in Python to facilitate data analysis, visualization, and modeling",
              "Presented weekly research updates with Tableau dashboards and made recommendations to primary investigator on study direction"
            ]
          }
        ],
        projects: [
          {
            id: 1,
            institution: "Oklahoma Christian University",
            location: "Edmond, OK",
            period: "June, 20xx – August, 20xx",
            title: "Undergraduate Researcher for the Computer Science Lab",
            tasks: [
              "Used SQL to extract and manipulate data from relational databases for $250K funding",
              "Maintained and updated existing data pipelines and extract, transform, and load ETL workflows to ensure data integrity and reliability",
              "Implemented data cleaning and preprocessing from raw Excel data to transfer into Stata for further analyses"
            ]
          }
        ],
        skills: [
          "Simple Linear Regression",
          "Multivariate Linear Regression",
          "Statistical Modeling",
          "Data Integrity",
          "Parametric Tests",
          "Nonparametric Tests",
          "Sampling Methods",
          "Natural Language Processing (NLP)",
          "Tableau",
          "R",
          "VBA",
          "Excel",
          "Python",
          "SQL",
          "Java"
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .resume {
    font-family: Arial, sans-serif;
    padding-top: 8%;
    padding-left: 10%;
    padding-right: 10%;
    padding-bottom: 8%;
    font-size:x-small;
    margin: 0 auto;
  }
  
  header {
    text-align: center;
    margin-bottom: 13px;
    border-bottom: 1px solid #000;
  }

  
  h1{
    color: #333;
    font-size: medium;
  }
  
  h2 {
    color: #333;
    font-size: small;
  }

  section h2 {
    border-bottom: 2px solid #000;
    padding-bottom: 5px;
    padding-top: 10px;
    font-size: 1.2em;
  }
  
  ul {
    padding-left: 20px;
    margin-bottom: 10px;
  }
  
  a {
    color: #007BFF;
    text-decoration: none;
  }

  .dated-row {
  display: flex;
  justify-content: space-between;
}
  </style>
  