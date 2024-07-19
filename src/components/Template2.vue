<template>
<v-container>
    <v-sheet class="resume" style="width: calc(90vh * 8.5 / 11); position:relative; margin:0 auto;">
        <div>
            <header>
                <h1>{{ firstName }} {{ lastName }}</h1>
                <p>{{ location }} | {{ phone }} | <a :href="`mailto:${email}`">{{ email }}</a> | <a :href="linkedinUrl">{{ linkedinUrl }}</a></p>
            </header>
            <section v-if="professionalSummary">
                <h2 style="font-family: 'Calibri';">PROFESSIONAL SUMMARY (Optional)</h2>
                <p>{{ professionalSummary }}</p>
            </section>
            <section >
                <h2>EDUCATION</h2>
                <div v-for="(education, index) in educations" :key="index" style="padding-bottom: 15px;">
                <p><strong>{{ education.institution }}</strong> | {{ education.startDate }} - {{ education.endDate }}</p>
                <p><strong><em>{{ education.degree }}</em></strong></p>
                <p>{{ education.gpa }}</p>
                <p>{{ education.abroad }}</p>
                <ul>
                    <li v-for="(program, index) in education.studyAbroadPrograms" :key="index">{{ program }}</li>
                </ul>
                </div>
            </section>
            <section>
                <h2>EXPERIENCE</h2>
                <div v-for="(experience, index) in experiences" :key="index">
                <p><strong>{{ experience.jobRole }}</strong>, {{ experience.companyName }} | {{ experience.startDate }} - {{ experience.endDate }}</p>
                <ul>
                    <li v-for="(bullet, index) in experience.bulletPoints" :key="index">{{ bullet }}</li>
                </ul>
                </div>
            </section>
        </div>
    </v-sheet>
</v-container>

    
  </template>
  
  <script>
  export default {
    data() {
      return {
        firstName: "First Name",
        lastName: "Last Name",
        location: "Edmond, OK",
        phone: "405.444.4444",
        email: "ike.eagle@eagles.oc.edu",
        linkedinUrl: "Linkedin Url / Website Url (optional)",
        professionalSummary: "Tells the reader the purpose of your resume in 3 (2-4 is okay) sentences • Should identify the kind of work you want to perform • If seeking an internship or co-op, include the time period when you are available to start. Example: Seeking a summer 2020 internship in Marketing or Public Relations.",
        educations: [
          {
            institution: "University of Oklahoma",
            startDate: "August 2023",
            endDate: "Projected May 2026",
            degree: "Master of XX",
            gpa: "GPA 4.0",
            studyAbroadPrograms: []
          },
          {
            institution: "Oklahoma Christian University",
            startDate: "August 2021",
            endDate: "Projected May 2025",
            degree: "Bachelor of Science Interdisciplinary Studies",
            gpa: "GPA (only list if above 3.0, or what is appropriate for your major)",
            abroad: 'Study Abroad Program Fall Semester 2008', 
            studyAbroadPrograms: [
              "Capital Normal | Beijing, China",
              "Ibaraki Christian | Ibaraki, Japan",
              "Macquarie University | Sydney, Australia"
            ]
          }
        ],
        experiences: [
          {
            jobRole: "Job Role",
            companyName: "Name of Company",
            startDate: "08/2022",
            endDate: "Present",
            bulletPoints: [
              "Accomplished {X} as measured by {Y}, by doing {Z}",
              "Action + Project/Problem = Results",
              "Three bullet points is sufficient for the most relevant position."
            ]
          },
          {
            jobRole: "Job Role",
            companyName: "Name of Company",
            startDate: "05/2022",
            endDate: "08/2022",
            bulletPoints: [
              "Developed concepts and designs for 10 clients, including consumer products, electronics and enterprise technology, utilizing Adobe Photoshop and Illustrator"
            ]
          },
          {
            jobRole: "Job Role",
            companyName: "Name of Company",
            startDate: "08/2018",
            endDate: "05/2022",
            bulletPoints: [
              "Developed concepts and designs for 10 clients wanting to bring more awareness to their company. Designs included consumer products, electronics and enterprise technology which boosted new customer engagement for all 10 clients."
            ]
          },
          {
            jobRole: "Job Role",
            companyName: "Name of Company",
            startDate: "01/2017",
            endDate: "08/2018",
            bulletPoints: [
              "Filed papers and organized 100+ employee documents a month to ensure compliance with employment law & successfully passed the annual audit all three years in the role."
            ]
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>

.resume {
    padding-top: 5%;
    padding-left: 8%;
    padding-right: 8%;
    padding-bottom: 15%;
    font-family: 'Times New Roman', Times, serif;
    font-size: x-small;
}

  header {
    text-align: left;
    font-family: 'Calibri';
  }
  h2 {
    margin-top: 20px;
    font-size: small;
    font-weight: bolder;
  }

  ul {
    padding-left: 50px;
  }
  </style>
  