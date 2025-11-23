export interface UserType {
  id: number;
  code: string;
}

export interface UserTypesResponse {
  data: {
    types: UserType[];
  };
}

export interface UserTypeMap {
  [typeId: number]: UserType;
}
