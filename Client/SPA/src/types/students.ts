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
  search?: string;
  departmentId?: number;
  educationLevel?: string;
  isArchived?: boolean;
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
