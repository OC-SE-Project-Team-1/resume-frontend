import jsPDF from "jspdf";
import StoryService from "../services/CreateStoryServices.js";
import {  ref } from "vue";

export default{
    async exportStory(id){
        const title = ref([]);
        const content = ref([]);
        //request story fron fAIrytales backend
        await StoryService.getOneStory(id)
        .then((response) => {
          title.value = response.data.title;
          content.value = response.data.story;
        })
        .catch((error) => {
          console.log(error);
        });

        //create document
        //W: 8.25     H: 11.25
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "in",
            format: "A4",
          })
    
        //add logo
        var img = new Image();
        img.src = "/fAIrytales-logo-mini.png";
        doc.addImage(img, "PNG", 0.5, 0.5, 1.5, 1.5);
        doc.setFontSize(16).setTextColor("#196CA2").setFont(undefined, "bold").text("fAIrytales", 1.8, 1.6);
        doc.setTextColor("#000")//set text back to black
        
        //add title
        doc.setFontSize(18).text(title.value, 1, 2.3, {maxWidth: 6.5});
          
        //add content
        doc.setLineWidth(1/72).setFont(undefined, "normal");
        var splitTitle = doc.setFontSize(12).splitTextToSize(content.value, 6.25);
        
        doc.page = 1;
        var y = 3;
        doc.setFontSize(10).text(7.3, 11.3, 'page ' + doc.page);
        for (var i = 0; i < splitTitle.length; i++) {                
            if (y > 11) {
                y = 1;
                doc.addPage();
                doc.setFontSize(10).text(7.3, 11.3, 'page ' + ++doc.page);
            }
            doc.setFontSize(12).text(splitTitle[i], 1, y,{maxWidth: 6.5});
            y = y + 0.05 + 12/72;
        }
        doc.save(title.value + `.pdf`);
    }
}