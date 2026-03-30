// despachos.test.js
// Configuración de Mocks para Google Apps Script

global.LockService = {
  getScriptLock: jest.fn(() => ({
    tryLock: jest.fn().mockReturnValue(true),
    releaseLock: jest.fn()
  }))
};

const mockSheetManifiestos = {
  getDataRange: jest.fn(() => ({
    getValues: jest.fn().mockReturnValue([
      ["ID_MANIFIESTO", "FECHA", "PATIO", "EMAIL_DESTINO", "ESTADO_PDF", "LINK_PDF"],
      ["123", "01/01/2026", "Patio A", "test@test.com", "GENERAR", ""]
    ])
  })),
  getRange: jest.fn(() => ({
    setValue: jest.fn()
  }))
};

const mockSheetDespachos = {
  getDataRange: jest.fn(() => ({
    getValues: jest.fn().mockReturnValue([
      ["ID_MANIFIESTO", "SOLICITANTE", "DESTINO_DE_LA_CARGA", "TIPO_DE_MATERIAL", "VOLUMEN_A_RETIRAR", "NOMBRE_DEL_CHOFER", "CEDULA_DEL_CHOFER", "TIPO_DE_VEHICULO", "MARCA", "MODELO", "PLACA"],
      ["123", "Cliente 1", "Destino Alpha", "Arena", "10 Ton", "Juan Perez", "12345678", "Camion", "Ford", "F-350", "ABC-123"]
    ])
  }))
};

global.SpreadsheetApp = {
  getActiveSpreadsheet: jest.fn(() => ({
    getSheetByName: jest.fn((name) => {
      if (name === "DB_Manifiestos") return mockSheetManifiestos;
      if (name === "DB_Despachos") return mockSheetDespachos;
      return null;
    })
  })),
  flush: jest.fn()
};

const mockBody = {
  replaceText: jest.fn()
};

const mockDoc = {
  getBody: jest.fn(() => mockBody),
  saveAndClose: jest.fn()
};

const mockFile = {
  getId: jest.fn(() => "mock-file-id"),
  getAs: jest.fn(() => "pdf-blob"),
  setTrashed: jest.fn(),
  getUrl: jest.fn(() => "http://mock.url.com")
};

global.DocumentApp = {
  openById: jest.fn(() => mockDoc)
};

const mockFolder = {
  createFile: jest.fn(() => mockFile)
};

global.DriveApp = {
  getFileById: jest.fn(() => ({
    makeCopy: jest.fn(() => mockFile)
  })),
  getFolderById: jest.fn(() => mockFolder)
};

global.Utilities = {
  sleep: jest.fn(),
  formatDate: jest.fn()
};

global.Session = {
  getScriptTimeZone: jest.fn(() => "America/Caracas")
};

global.MailApp = {
  sendEmail: jest.fn()
};

global.MimeType = {
  PDF: "application/pdf"
};

// Importar la función (Suponiendo que se puede cargar en entorno Node)
// Como test.js no exporta módulos, en Jest lo evaluamos en el mismo contexto
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname, '../test.js'), 'utf8');
eval(code);

describe('Procesar Manifiestos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe tomar el lock de forma exitosa e iniciar el procesamiento', () => {
    procesarManifiestosPendientes();
    
    // Verificamos que pidió el lock
    expect(global.LockService.getScriptLock).toHaveBeenCalled();
    
    // Verificamos que intentó procesar la fila 1 (index 1 = row 2) cambiando a PROCESANDO
    expect(mockSheetManifiestos.getRange).toHaveBeenCalledWith(2, 5); // INDEX ESTADO_PDF = 4 (0-based) => Columna 5
  });
  
  test('debe enviar correo electrónico si se generó el manifiesto', () => {
     procesarManifiestosPendientes();
     expect(global.MailApp.sendEmail).toHaveBeenCalledWith(expect.objectContaining({
       to: "test@test.com",
       subject: expect.stringContaining("Manifiesto de Despachos")
     }));
  });
});
