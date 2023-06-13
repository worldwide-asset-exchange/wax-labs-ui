export interface Withdraw {
  account_owner: string;
  quantity: string;
}

export interface Profile {
  wax_account: string;
}

export interface DeleteCategory {
  category_name: string;
}

export interface NewCategory {
  new_category: string;
}

export interface MinRequested {
  new_min_requested: string;
}

export interface MaxRequested {
  new_max_requested: string;
}

export interface SetAdmin {
  new_admin: string;
}
