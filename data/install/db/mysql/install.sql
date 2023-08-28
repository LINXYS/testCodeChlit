create table if not exists lexoffice_bulk_generation_workers
(
	`ID` INT NOT NULL auto_increment,
	`DEAL_ID` INT NOT NULL,
    `STATUS` VARCHAR(50) NOT NULL,
	PRIMARY KEY (`ID`)
);
