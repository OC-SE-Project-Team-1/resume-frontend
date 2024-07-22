<template>
<v-container>
  <v-sheet style="width: calc(90vh * 8.5 / 11);
          margin: 0 auto; 
          position: relative;"
          >
  <div class="resume">
          <header>
                  <h1>{{ name }}</h1>
                  <p>{{ city }}, {{ state }} ♦ {{ phone }} ♦ {{ email }} ♦ <a :href="linkedin">{{ linkedin }}</a></p>
          </header>


      <section>
        <h2>OBJECTIVE</h2>
        <p>{{ objective }}</p>
      </section>
      
      <section>
        <h2>EDUCATION</h2>
        <div class="dated-row">
          <div>
        <p><strong>{{ education.institution }}</strong>, {{ education.location }}</p>
          </div>
          <div>
 <p>{{ education.startDate }} - {{ education.endDate }}</p>
          </div>
        </div>

        <p>{{ education.degree }}</p>
        <p v-if="education.minor">Minor: {{ education.minor }}</p>
        <p>Major GPA: {{ education.majorGPA }}; Cumulative GPA: {{ education.cumulativeGPA }}</p>
        <p v-if="education.coursework.length">Coursework: {{ education.coursework.join(', ') }}</p>
      </section>
      
      <section>
        <h2>{{ leadership.title }}</h2>
        <div class="dated-row">
            <div>
          <p><strong>{{ leadership.organization }}</strong></p>
            </div>
            <div>
          <p>{{ leadership.dateRange }}</p>
        </div>
      </div>
        <div v-for="item in leadership.items" :key="item.organization">
          <div v-for="position in item.positions" :key="position.title">
            <p><em>{{ position.title }}</em> ({{ position.dateRange }})</p>
            <ul>
              <li v-for="duty in position.duties" :key="duty">{{ duty }}</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section>
        <h2>{{ workExperience.title }}</h2>
        <div v-for="item in workExperience.items" :key="item.company">
          <div class="dated-row">
            <div>
          <p>{{ item.company }}, {{ item.location }}</p>
            </div>
            <div>
          <p>{{ item.dateRange }}</p>
            </div>
          </div>
          <p><strong><em>{{ item.title }}</em></strong></p>
          <ul>
            <li v-for="duty in item.duties" :key="duty">{{ duty }}</li>
          </ul>
        </div>
      </section>
      
      <section>
        <h2>{{ honors.title }}</h2>
        <div v-for="honor in honors.items" :key="honor.name">
          <div class="dated-row">
            <div>
          <p><strong>{{ honor.name }} </strong></p>
            </div>
            <div>
          <p>{{ honor.dateRange }}</p>
            </div>
          </div>
          <ul>
            <li v-for="detail in honor.details" :key="detail">{{ detail }}</li>
          </ul>
        </div>
      </section>
      
      <section>
        <h2>SKILLS</h2>
        <ul style="padding-left: 0%;">
          <li style="list-style-type: none;" v-for="skill in skills" :key="skill">{{ skill }}</li>
        </ul>
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
        city: "City",
        state: "State",
        phone: "Phone Number",
        email: "Email Address",
        linkedin: "LinkedIn or Website URL",
        objective: "Recent graduate with a degree in marketing seeking an entry-level position in digital marketing. Experienced in creating social media campaigns and analyzing data to drive engagement and sales.",
        education: {
          institution: "Oklahoma Christian University",
          location: "Oklahoma City, OK",
          startDate: "Start Month, Year",
          endDate: "Projected Month, Year",
          degree: "Bachelor of Arts /Bachelor of Science in XX /B.B.A in XX",
          minor: "Minor(s) in…. (if applicable)",
          majorGPA: "#.##",
          cumulativeGPA: "#.##",
          coursework: ["Course 1", "Course 2", "Course 3"]
        },
        leadership: {
          title: "LEADERSHIP (or WORK EXPERIENCE, ACTIVITIES, VOLUNTEER WORK)",
          organization: "Organization Name",
          dateRange: "Month Year – Month Year",
          items: [
          {
              dateRange: "Month Year – Month Year",
              positions: [
                {
                  title: "Position Title",
                  dateRange: "Month Year – Month Year",
                  duties: [
                    "Action Verb, followed by description of most relevant or important duties and accomplishments"
                  ]
                }
              ]
            },
            {
              dateRange: "Month Year – Month Year",
              positions: [
                {
                  title: "Position Title",
                  dateRange: "Month Year – Month Year",
                  duties: [
                    "Action Verb, followed by description of most relevant or important duties and accomplishments"
                  ]
                }
              ]
            }
          ]
        },
        workExperience: {
          title: "WORK EXPERIENCE (or LEADERSHIP, ACTIVITIES, VOLUNTEER WORK)",
          items: [
            {
              company: "Company Name",
              location: "City, State",
              dateRange: "Month Year – Month Year",
              title: "Job Title",
              duties: [
                "Action Verb, followed by description of most relevant or important duties and accomplishments",
                "Action Verb, followed by description of most relevant or important duties and accomplishments"
              ]
            }
          ]
        },
        honors: {
          title: "HONORS (and/or AWARDS)",
          items: [
            {
              name: "Honor/Award/Organization",
              dateRange: "Month Year – Month Year",
              details: [
                "Action Verb, followed by criteria for selection or explanation of involvement"
              ]
            }
          ]
        },
        skills: [
          "List language skills and declare fluency (if applicable)",
          "List relevant computer skills"
        ]
      };
    }
  };
  </script>
  
  <style scoped>

.resume {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0 auto;
    padding-top: 7%;
    padding-left: 12%;
    padding-right: 12%;
    padding-bottom: 5%;
    font-size: x-small;
  }
  
  header {
    text-align: center;
  }
  
  header h1 {
    margin: 0;
    font-size: medium;
  }
  
  header p {
    margin: 0px 0;
  }

  h1 {
    color: #2c3e50;
  }
  
  h2 {
    color: #2c3e50;
    font-size: 1.1em;

    padding-top: 10px;
  }
  
  ul {
    list-style-type: disc;
    padding-left: 30px;
  }

  .dated-row {
  display: flex;
  justify-content: space-between;
}

  </style>
  