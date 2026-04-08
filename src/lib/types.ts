export enum VisitorType {
    CONTRACTOR = 'contractor',
    INTERVIEWEE = 'interviewee',
    VENDOR = 'vendor',
    GUEST = 'guest',
    DELIVERY = 'delivery',
}

export enum VisitorStatus {
    ON_SITE = 'on-site',
    CHECKED_OUT = 'checked-out',
    PRE_BOOKED = 'pre-booked',
    PENDING = 'pending',
}

export enum UserRole {
    PLATFORM_ADMIN = 'platform_admin',
    COMPANY_ADMIN = 'company_admin',
    SITE_ADMIN = 'site_admin',
    SECURITY = 'security',
    HOST = 'host',
}

export interface Company {
    id: string;
    name: string;
    domain: string;
    logoUrl?: string;
    status: 'ACTIVE' | 'SUSPENDED';
}

export interface Site {
    id: string;
    companyId: string;
    name: string;
    code: string;
    address: string;
    contactNumber: string;
    contactEmail: string;
    managerId: string;
    operatingHours: string;
    maxOccupancy: number;
    qrPrefix: string;
    type: 'OFFICE' | 'WAREHOUSE' | 'EVENT' | 'ESTATE' | 'OTHER';
    status: 'ACTIVE' | 'INACTIVE' | 'OFFLINE';
    lastActivityAt?: string;
}

export interface EntryPoint {
    id: string;
    siteId: string;
    name: string;
    type: 'GATE' | 'RECEPTION' | 'SECURITY';
    status: 'ACTIVE' | 'OFFLINE';
    lastGuardId?: string;
    lastDeviceId?: string;
}

export interface User {
    id: string;
    companyId?: string;
    siteId?: string; 
    siteIds?: string[]; // Supporting multi-site assignments
    role: UserRole;
    fullName: string;
    email: string;
}

export interface VehicleData {
    registration: string;
    licenceDiscScanned: boolean;
    vin?: string;
}

export interface Visitor {
    id: string;
    companyId: string;
    siteId: string;
    name: string;
    email?: string;
    phone: string;
    company?: string;
    type: VisitorType;
    status: 'PENDING' | 'ARRIVED' | 'EXPIRED' | 'CANCELLED' | 'ON_SITE' | 'CHECKED_OUT';
    checkIn?: string;
    checkOut?: string;
    hostId: string;
    hostName: string;
    purpose?: string;
    arrivalTime?: string;
    expectedDuration?: string;
    vehicleData?: VehicleData;
    qrToken?: string;
    qrExpiry?: string;
    entryType?: 'ONE_TIME' | 'MULTIPLE';
    earlyCheckInMinutes?: number;
    scanAttempts?: number;
    createdBy?: string;
    createdAt?: string;
}

export interface Booking {
    id: string;
    companyId: string;
    siteId: string;
    visitorId: string;
    hostId: string;
    scheduledTime: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

export interface Employee {
    id: string;
    companyId: string;
    siteId: string;
    fullName: string;
    department: string;
    isHost: boolean;
}

export interface StatCard {
    label: string;
    value: string;
    change: number;
    icon: string;
}

export interface Transaction {
    id: string;
    visitorId: string;
    siteId: string;
    checkIn: string;
    checkOut?: string;
    status: 'ON_SITE' | 'CHECKED_OUT';
}
