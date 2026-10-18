interface ImportMetaEnv {
  readonly DRIVE_API_KEY?: string
  readonly DRIVE_WORKSHEETS_FOLDER_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
