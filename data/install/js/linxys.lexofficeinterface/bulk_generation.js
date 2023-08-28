var BulkGeneration = BX.namespace('BulkGeneration');

BX.BulkGeneration.runGenerateBJ = function(button, type)
{
	BX.addClass(button, "ui-btn-wait");

	BX.ajax.runAction('linxys:lexofficeinterface.api.ajaxhandler.runGeneration',
	{
		data:
		{
			"type": type,
		}
	}).then(function(response)
	{
		// success
		BX.removeClass(button, "ui-btn-wait");
		if(response.status == 'success' && response.data.RESULT == "OK")
		{
			if(response.data.MESSAGE)
			{
				BX.UI.Notification.Center.notify(
				{
					content: response.data.MESSAGE
				});
			}
			if(response.data.TOTAL_DEALS > 0)
			{
				BX.adjust(button, {style: {"display": "none"}});
				BX.BulkGeneration.displayStopButton();

				//pull command
				BX.ajax.runAction('linxys:lexofficeinterface.api.ajaxhandler.startGeneration',
				{
					data:{"type": type}
				}).then(function(response)
				{
					console.log(response);

				}, function(response)
				{
					console.log(response);
				});
			}
		}
	}, function(response)
	{
		console.log(response);
		BX.removeClass(button, "ui-btn-wait");
		BX.UI.Notification.Center.notify(
		{
			content: "An error occurred during the start of generation "
		});
	});
}

BX.BulkGeneration.stopGenerateBJ = function(button, type)
{
	BX.addClass(button, "ui-btn-wait");

	//stop process
	BX.ajax.runAction('linxys:lexofficeinterface.api.ajaxhandler.stopGeneration',
	{
		data:
		{
			"stop": true,
		}
	}).then(function(response)
	{
		console.log(response);

	}, function(response)
	{
		console.log(response);
	});
}

BX.BulkGeneration.displayStartButton = function()
{
	BX.adjust(BX('start-bulk-generation'), {style: {"display": "block"}});
}

BX.BulkGeneration.hideStartButton = function()
{
	BX.adjust(BX('start-bulk-generation'), {style: {"display": "none"}});
}

BX.BulkGeneration.displayStopButton = function()
{
	BX.adjust(BX('stop-bulk-generation'), {style: {"display": "block"}});
}

BX.BulkGeneration.hideStopButton = function()
{
	BX.adjust(BX('stop-bulk-generation'), {style: {"display": "none"}});
}

BX.BulkGeneration.bindForPullCommand = function()
{
	console.log('bindForPullCommand');
	// find div.pagetitle-below
	var pageTitleBelowBlock = BX.findChild(document, {
		tag: "div",
		class: "pagetitle-below"
	}, true);

	var progressBarsWrapper = BX.create('div',
	{
		attrs: {
			id: 'progress-bars-wrapper',
		}
	});
	BX.insertAfter(progressBarsWrapper, pageTitleBelowBlock);

	BX.addCustomEvent('onPullEvent-linxys.lexofficeinterface', function(command, params)
	{
		if(command == 'updateBulkGenerationProgressBar')
		{
			console.log(params);

			if (params.total <= params.current)
			{
				BX.adjust(progressBarsWrapper, {style: {"display": "none"}});
			}

			if(window[params.entity])
			{
				if (params.total != params.current) {
					BX.adjust(progressBarsWrapper, {style: {"display": "block"}});
				}
				window[params.entity].update(params.current);
			} else {
				var progressBar = new BX.UI.ProgressBar({
					color: BX.UI.ProgressBar.Color.WARNING,
					fill: true,
					statusType: BX.UI.ProgressBar.Status.COUNTER,
					maxValue: params.total,
					value: 0,
					textBefore: "Generation process for: " + params.entity,
					column: false
				});
				progressBar.update(params.current);

				window[params.entity] = progressBar;

				BX.adjust(progressBarsWrapper,  {style: {"margin-bottom": "5px"}});
				BX.append(progressBar.getContainer(), progressBarsWrapper);
			}
		}

		if(command == 'updateStartStopButtonBulkGeneration')
		{
			console.log(params);

			if (params.command == 'showStopButton')
			{
				BX.BulkGeneration.displayStopButton();
			}

			if (params.command == 'hideStopButton')
			{
				BX.BulkGeneration.hideStopButton();
			}

			if (params.command == 'showStartButton')
			{
				BX.BulkGeneration.displayStartButton();
			}

			if (params.command == 'hideStartButton')
			{
				BX.BulkGeneration.hideStartButton();
			}
		}
	});
}
