export interface Student {
  id: string;
  fullName: string;
  admissionYear: number;
  graduationYear?: number;
  educationLevel: string;
  isSuccess: boolean;
  departmentId: number;
  departmentName?: string;
  facultyName?: string;
  isArchived: boolean;
}

export interface StudentSearchParams {
  search?: string | undefined;
  departmentId?: number | undefined;
  educationLevel?: string | undefined;
  isArchived?: boolean | undefined;
}

export interface Department {
  id: number;
  name: string;
  headName: string;
  facultyId: number;
  facultyName?: string;
}

export interface Faculty {
  id: number;
  name: string;
}
