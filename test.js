function procesarDespachosOnChange(e) {
  procesarManifiestosPendientes();
}

function procesarManifiestosPendientes() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return; // Evita ejecuciones simultáneas

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetManifiestos = ss.getSheetByName("DB_Manifiestos");
    const sheetDespachos = ss.getSheetByName("DB_Despachos");
    
    if (!sheetManifiestos || !sheetDespachos) return;

    const dataMan = sheetManifiestos.getDataRange().getValues();
    const headersMan = dataMan[0];
    const dataDesp = sheetDespachos.getDataRange().getValues();
    const headersDesp = dataDesp[0];

    // Índices Manifiestos
    const idxIdMan = headersMan.indexOf("ID_MANIFIESTO");
    const idxFecha = headersMan.indexOf("FECHA");
    const idxPatio = headersMan.indexOf("PATIO");
    const idxEmail = headersMan.indexOf("EMAIL_DESTINO");
    const idxEstado = headersMan.indexOf("ESTADO_PDF");
    const idxLink = headersMan.indexOf("LINK_PDF");

    // Índices Despachos
    const dIdxIdMan = headersDesp.indexOf("ID_MANIFIESTO");
    const dIdxSol = headersDesp.indexOf("SOLICITANTE");
    const dIdxDest = headersDesp.indexOf("DESTINO_DE_LA_CARGA");
    const dIdxMat = headersDesp.indexOf("TIPO_DE_MATERIAL");
    const dIdxVol = headersDesp.indexOf("VOLUMEN_A_RETIRAR");
    const dIdxChof = headersDesp.indexOf("NOMBRE_DEL_CHOFER");
    const dIdxCed = headersDesp.indexOf("CEDULA_DEL_CHOFER");
    const dIdxVeh = headersDesp.indexOf("TIPO_DE_VEHICULO");
    const dIdxMar = headersDesp.indexOf("MARCA");
    const dIdxMod = headersDesp.indexOf("MODELO");
    const dIdxPla = headersDesp.indexOf("PLACA");

    // CONFIGURACIÓN DE IDs
    const TEMPLATE_ID = "1gIwWjIXA2QRKClUOMJs6ACsm2W3e5Qd9JJmi2yIIAls"; 
    const FOLDER_ID = "1SEHXgIRYb_uCr5RycAHDD-MeV1_uIn0h"; 

    for (let i = 1; i < dataMan.length; i++) {
      let row = dataMan[i];
      let estado = row[idxEstado];
      
      if (estado === "GENERAR") {
        try {
          // Marcar como PROCESANDO inmediatamente
          sheetManifiestos.getRange(i+1, idxEstado+1).setValue("PROCESANDO");
          SpreadsheetApp.flush(); // Fuerza la actualización a la hoja
          
          let idManifiesto = row[idxIdMan];
          let patio = row[idxPatio];
          let fecha = row[idxFecha];
          let email = row[idxEmail];

          // 1. Filtrar los camiones de este manifiesto (excluyendo cabeceras)
          let despachos = dataDesp.slice(1).filter(d => d[dIdxIdMan] == idManifiesto);
          
          // 2. Agrupar la data para emular lista
          let bodyText = "";
          let countSol = 1;
          let bySol = {};
          despachos.forEach(d => {
            let sol = d[dIdxSol];
            if(!bySol[sol]) bySol[sol] = [];
            bySol[sol].push(d);
          });

          for (let sol in bySol) {
            bodyText += countSol + ". A nombre de: " + sol + "\n";
            let byDest = {};
            bySol[sol].forEach(d => {
              let dest = d[dIdxDest];
              if(!byDest[dest]) byDest[dest] = [];
              byDest[dest].push(d);
            });

            for (let dest in byDest) {
               bodyText += "Destino: " + dest + "\n";
               bodyText += "Material:\n";
               let byMat = {};
               byDest[dest].forEach(d => {
                 let matKey = d[dIdxMat] + " " + (d[dIdxVol] ? d[dIdxVol] : "");
                 if(!byMat[matKey]) byMat[matKey] = [];
                 byMat[matKey].push(d);
               });
               for(let mat in byMat) {
                 bodyText += "        " + mat + "\n";
               }
               bodyText += "        Conductor:\n";
               let conductores = byDest[dest];
               for(let c=0; c<conductores.length; c++) {
                 let d = conductores[c];
                 bodyText += "        " + (c+1) + ") " + d[dIdxChof] + " C.I. " + d[dIdxCed] + "\n";
                 bodyText += "        Vehículo: " + (d[dIdxVeh]?d[dIdxVeh]:"") + " " + (d[dIdxMar]?d[dIdxMar]:"") + "\n";
                 bodyText += "        PLACA: " + d[dIdxPla] + "\n";
               }
               bodyText += "\n";
            }
            countSol++;
          }

          // 3. Crear PDF
          let docFile = DriveApp.getFileById(TEMPLATE_ID).makeCopy("Manifiesto_" + idManifiesto, DriveApp.getFolderById(FOLDER_ID));
          let doc = DocumentApp.openById(docFile.getId());
          let body = doc.getBody();
          body.replaceText("{{PATIO}}", patio || "");
          
          let fechaStr = fecha;
          if(fecha instanceof Date) {
            fechaStr = Utilities.formatDate(fecha, Session.getScriptTimeZone(), "dd/MM/yyyy");
          }
          body.replaceText("{{FECHA}}", fechaStr || "");
          body.replaceText("{{CONTENIDO_DINAMICO}}", bodyText);
          
          doc.saveAndClose();
          
          Utilities.sleep(2000); // Dar tiempo a los servidores de Drive para reflejar los cambios
          
          let pdfBlob = docFile.getAs(MimeType.PDF);
          let folder = DriveApp.getFolderById(FOLDER_ID);
          let pdfFile = folder.createFile(pdfBlob);
          docFile.setTrashed(true); 
          let pdfUrl = pdfFile.getUrl();
          
          // Enviar Correo Electrónico
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if(email && emailRegex.test(email.toString().trim())) {
             MailApp.sendEmail({
               to: email,
               subject: "Manifiesto de Despachos: " + (patio||""),
               body: "Se adjunta a este correo el formato de despacho autorizado.",
               attachments: [pdfBlob]
             });
          }
          
          // 4. Marcar completado
          sheetManifiestos.getRange(i+1, idxEstado+1).setValue("ENVIADO");
          sheetManifiestos.getRange(i+1, idxLink+1).setValue(pdfUrl);

        } catch (e) {
          sheetManifiestos.getRange(i+1, idxEstado+1).setValue("ERROR: " + e.message);
        }
      }
    }
  } finally {
    lock.releaseLock();
  }
}
