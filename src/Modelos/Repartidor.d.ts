export interface IDelivery {
    Id?: number;
    Admin_Id?: number;
    Name: string;
    LastName: string;
    State: string;
    City: string;
    User?: string;
    Password: string;
    Email: string;
    Is_Verified?: boolean;
    Insignia?: number
    Service: string;
    Occupation: string;
    Role_Id?: string;
    Bank: string,
    Account: string,
    AccNumber: string,
}