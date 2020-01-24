export interface User {
  name: string
  role: string
  headerName: string
  headerValue: string
}

export interface DenormalizedUser extends User {
  config: string
  application: string
}

export interface Application {
  name: string
  urls: string[]
  users: User[]
}

interface Config {
  name: string
  url: string
  applications: Application[]
}

export default Config
