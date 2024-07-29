import jsPDF from "jspdf";

export default{
    async exportResume(html){
       
        //create document
        //W: 8.25     H: 11.25
        const doc = new jsPDF('a4')
          doc.html(html, {
            callback: function(doc) {
                // Save the PDF
                doc.save('document-html.pdf');
            },
            margin: [0.5, 0.5,],
            autoPaging: 'text',
            x: 0,
            y: 0,
            width: 215, //target width in the PDF document
            windowWidth: 725 //window width in CSS pixels
        });

    }
}